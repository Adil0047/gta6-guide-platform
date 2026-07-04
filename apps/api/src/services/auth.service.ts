import { createHash } from 'node:crypto';

import {
  type LoginRequestDto,
  type RegisterRequestDto,
  type UserDto,
} from '@gta6-guide/shared/dto';
import { type UserRole } from '@gta6-guide/shared/roles';
import { type UserStatus } from '@gta6-guide/shared/users';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env.js';
import { RefreshTokenModel } from '@/models/RefreshToken.model.js';
import { UserModel } from '@/models/User.model.js';
import { AppError } from '@/utils/appError.js';
import { hashPassword, verifyPassword } from '@/utils/password.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/tokens.js';

type RegisterInput = RegisterRequestDto;

type LoginInput = LoginRequestDto & {
  ip?: string;
  userAgent?: string;
};

function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function getRefreshExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

function serializeUser(user: {
  _id: unknown;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  isEmailVerified?: boolean;
}): UserDto {
  return {
    id: String(user._id),
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar: user.avatar ?? '',
    bio: user.bio ?? '',
    isEmailVerified: Boolean(user.isEmailVerified),
  };
}

function createAccessTokenFromUser(user: {
  _id: unknown;
  email: string;
  username: string;
  role: UserRole;
}) {
  return signAccessToken({
    sub: String(user._id),
    email: user.email,
    username: user.username,
    role: user.role,
  });
}

async function persistRefreshToken(token: string, userId: string, ip?: string, userAgent?: string) {
  await RefreshTokenModel.create({
    userId,
    tokenHash: hashToken(token),
    expiresAt: getRefreshExpiryDate(),
    createdByIp: ip ?? '',
    userAgent: userAgent ?? '',
  });
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await UserModel.findOne({
    $or: [{ email: input.email }, { username: input.username }],
  }).lean();

  if (existingUser) {
    throw new AppError('Email or username already exists', StatusCodes.CONFLICT);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await UserModel.create({
    name: input.name,
    username: input.username,
    email: input.email,
    passwordHash,
  });

  return serializeUser(user);
}

export async function loginUser(input: LoginInput) {
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');

  if (!user) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  if (user.status !== 'active') {
    throw new AppError('Account is not active', StatusCodes.FORBIDDEN);
  }

  const isPasswordValid = await verifyPassword(input.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', StatusCodes.UNAUTHORIZED);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = createAccessTokenFromUser(user);
  const refreshToken = signRefreshToken({
    sub: String(user._id),
    tokenVersion: user.refreshTokenVersion,
  });

  await persistRefreshToken(refreshToken, String(user._id), input.ip, input.userAgent);

  return {
    user: serializeUser(user),
    accessToken,
    refreshToken,
  };
}

export async function refreshAuth(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const tokenRecord = await RefreshTokenModel.findOne({
    tokenHash,
    revokedAt: { $exists: false },
    expiresAt: { $gt: new Date() },
  });

  if (!tokenRecord) {
    throw new AppError('Invalid refresh token', StatusCodes.UNAUTHORIZED);
  }

  const user = await UserModel.findById(payload.sub);

  if (!user || user.status !== 'active') {
    throw new AppError('User is not authorized', StatusCodes.UNAUTHORIZED);
  }

  if (user.refreshTokenVersion !== payload.tokenVersion) {
    throw new AppError('Refresh token has been revoked', StatusCodes.UNAUTHORIZED);
  }

  tokenRecord.revokedAt = new Date();
  await tokenRecord.save();

  const newAccessToken = createAccessTokenFromUser(user);
  const newRefreshToken = signRefreshToken({
    sub: String(user._id),
    tokenVersion: user.refreshTokenVersion,
  });

  await persistRefreshToken(newRefreshToken, String(user._id));

  return {
    user: serializeUser(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logoutUser(refreshToken?: string, ip?: string) {
  if (!refreshToken) {
    return;
  }

  await RefreshTokenModel.findOneAndUpdate(
    { tokenHash: hashToken(refreshToken) },
    {
      revokedAt: new Date(),
      revokedByIp: ip ?? '',
    },
  );
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await UserModel.findById(userId).select('+passwordHash');

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  const isPasswordValid = await verifyPassword(currentPassword, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', StatusCodes.BAD_REQUEST);
  }

  user.passwordHash = await hashPassword(newPassword);
  user.passwordChangedAt = new Date();
  user.refreshTokenVersion += 1;

  await user.save();

  await RefreshTokenModel.updateMany({ userId }, { revokedAt: new Date() });

  return serializeUser(user);
}

export function getRefreshTokenFromSignedCookies(signedCookies: Record<string, unknown>) {
  const value = signedCookies[env.REFRESH_TOKEN_COOKIE_NAME];

  return typeof value === 'string' ? value : undefined;
}
