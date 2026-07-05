import {
  ADMIN_ROLES as SHARED_ADMIN_ROLES,
  AUTHENTICATED_ROLES as SHARED_AUTHENTICATED_ROLES,
  USER_ROLE_VALUES,
  type UserRole,
} from '@gta6-guide/shared/roles';
import { type AuthSessionDto, type UserDto } from '@gta6-guide/shared/dto';

import { storage } from '@/lib/storage';

export type AuthRole = UserRole;

export type AuthUser = UserDto;

export type AuthSession = {
  user: AuthUser;
  accessToken?: string;
};

const AUTH_SESSION_STORAGE_KEY = 'gta6-guide-auth-user';

let accessTokenMemory: string | null = null;

export const ADMIN_ROLES: AuthRole[] = [...SHARED_ADMIN_ROLES];
export const AUTHENTICATED_ROLES: AuthRole[] = [...SHARED_AUTHENTICATED_ROLES];

function isAuthRole(role: unknown): role is AuthRole {
  return typeof role === 'string' && USER_ROLE_VALUES.includes(role as AuthRole);
}

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Partial<AuthUser>;

  return Boolean(user.id && typeof user.id === 'string' && isAuthRole(user.role));
}

export function getAccessToken() {
  return accessTokenMemory;
}

export function setAccessToken(accessToken: string | null) {
  accessTokenMemory = accessToken;
}

export function getAuthSession() {
  const rawUser = storage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as unknown;

    return isAuthUser(parsedUser)
      ? {
          user: parsedUser,
          accessToken: accessTokenMemory ?? undefined,
        }
      : null;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSessionDto) {
  accessTokenMemory = session.accessToken;
  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session.user));
}

export function clearAuthSession() {
  accessTokenMemory = null;
  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function isAdminRole(role: AuthRole) {
  return ADMIN_ROLES.includes(role);
}
