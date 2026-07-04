import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';

import { env } from '@/config/env.js';
import { type UserRole } from '@gta6-guide/shared/roles';

export type AccessTokenPayload = {
  sub: string;
  role: UserRole;
  email: string;
  username: string;
};

export type RefreshTokenPayload = {
  sub: string;
  tokenVersion: number;
};

export function signAccessToken(payload: AccessTokenPayload) {
  const secret: Secret = env.JWT_ACCESS_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  const secret: Secret = env.JWT_REFRESH_SECRET;
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
