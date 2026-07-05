import { type UpdateProfileDto, type UserDto } from '@gta6-guide/shared/dto';
import { createPaginationMeta, getPagination } from '@gta6-guide/shared/pagination';
import { USER_ROLES, isAdminRole, type UserRole } from '@gta6-guide/shared/roles';
import { type UserStatus } from '@gta6-guide/shared/users';
import { StatusCodes } from 'http-status-codes';

import { UserModel } from '@/models/User.model.js';
import { AppError } from '@/utils/appError.js';

type Actor = {
  id: string;
  role: UserRole;
};

function sanitizeUser(user: {
  _id: unknown;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  isEmailVerified?: boolean;
  preferences?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
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
    preferences: user.preferences,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function countActivePrivilegedUsers() {
  return UserModel.countDocuments({
    role: { $in: [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] },
    status: 'active',
  });
}

async function countActiveSuperAdmins() {
  return UserModel.countDocuments({
    role: USER_ROLES.SUPER_ADMIN,
    status: 'active',
  });
}

function preventSelfAdministration(actor: Actor, targetId: string) {
  if (actor.id === targetId) {
    throw new AppError('You cannot change your own administrative access', StatusCodes.FORBIDDEN);
  }
}

async function assertPrivilegedAccountSafety(target: { role: UserRole; status: UserStatus }, next: {
  role?: UserRole;
  status?: UserStatus;
}) {
  const nextRole = next.role ?? target.role;
  const nextStatus = next.status ?? target.status;
  const targetIsActivePrivileged = isAdminRole(target.role) && target.status === 'active';
  const targetIsActiveSuperAdmin = target.role === USER_ROLES.SUPER_ADMIN && target.status === 'active';

  if (targetIsActiveSuperAdmin && (nextRole !== USER_ROLES.SUPER_ADMIN || nextStatus !== 'active')) {
    const activeSuperAdminCount = await countActiveSuperAdmins();

    if (activeSuperAdminCount <= 1) {
      throw new AppError('Cannot weaken the last active super admin account', StatusCodes.CONFLICT);
    }
  }

  if (targetIsActivePrivileged && (!isAdminRole(nextRole) || nextStatus !== 'active')) {
    const activePrivilegedUserCount = await countActivePrivilegedUsers();

    if (activePrivilegedUserCount <= 1) {
      throw new AppError('Cannot weaken the last active privileged account', StatusCodes.CONFLICT);
    }
  }
}

export async function getProfile(userId: string) {
  const user = await UserModel.findById(userId).lean();

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return sanitizeUser(user);
}

export async function updateProfile(userId: string, input: UpdateProfileDto) {
  if (typeof input.username === 'string') {
    const existingUser = await UserModel.findOne({
      username: input.username,
      _id: { $ne: userId },
    }).lean();

    if (existingUser) {
      throw new AppError('Username already exists', StatusCodes.CONFLICT);
    }
  }

  const user = await UserModel.findByIdAndUpdate(userId, input, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return sanitizeUser(user);
}

export async function listUsers(query: unknown) {
  const { page, limit, skip } = getPagination(query);
  const parsedQuery = query as {
    q?: string;
    role?: UserRole;
    status?: UserStatus;
  };

  const filter: Record<string, unknown> = {};

  if (parsedQuery.role) {
    filter.role = parsedQuery.role;
  }

  if (parsedQuery.status) {
    filter.status = parsedQuery.status;
  }

  if (parsedQuery.q) {
    filter.$or = [
      { name: { $regex: parsedQuery.q, $options: 'i' } },
      { username: { $regex: parsedQuery.q, $options: 'i' } },
      { email: { $regex: parsedQuery.q, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    UserModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    UserModel.countDocuments(filter),
  ]);

  return {
    items: users.map(sanitizeUser),
    meta: createPaginationMeta(total, page, limit),
  };
}

export async function updateUserRole(userId: string, role: UserRole, actor: Actor) {
  preventSelfAdministration(actor, userId);

  const currentUser = await UserModel.findById(userId).lean();

  if (!currentUser) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  if (currentUser.role === USER_ROLES.SUPER_ADMIN && actor.role !== USER_ROLES.SUPER_ADMIN) {
    throw new AppError('Only a super admin can change a super admin account', StatusCodes.FORBIDDEN);
  }

  if (role === USER_ROLES.SUPER_ADMIN && actor.role !== USER_ROLES.SUPER_ADMIN) {
    throw new AppError('Only a super admin can assign the super admin role', StatusCodes.FORBIDDEN);
  }

  await assertPrivilegedAccountSafety(currentUser, { role });

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { role },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return sanitizeUser(user);
}

export async function updateUserStatus(userId: string, status: UserStatus, actor: Actor) {
  preventSelfAdministration(actor, userId);

  const currentUser = await UserModel.findById(userId).lean();

  if (!currentUser) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  if (currentUser.role === USER_ROLES.SUPER_ADMIN && actor.role !== USER_ROLES.SUPER_ADMIN) {
    throw new AppError('Only a super admin can change a super admin account', StatusCodes.FORBIDDEN);
  }

  await assertPrivilegedAccountSafety(currentUser, { status });

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { status },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  if (!user) {
    throw new AppError('User not found', StatusCodes.NOT_FOUND);
  }

  return sanitizeUser(user);
}
