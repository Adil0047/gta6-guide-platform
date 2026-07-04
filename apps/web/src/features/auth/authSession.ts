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

export type AuthSession = AuthSessionDto;

const AUTH_SESSION_STORAGE_KEY = 'gta6-guide-auth-session';

export const ADMIN_ROLES: AuthRole[] = [...SHARED_ADMIN_ROLES];
export const AUTHENTICATED_ROLES: AuthRole[] = [...SHARED_AUTHENTICATED_ROLES];

function isAuthRole(role: unknown): role is AuthRole {
  return typeof role === 'string' && USER_ROLE_VALUES.includes(role as AuthRole);
}

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const session = value as Partial<AuthSession>;

  return Boolean(
    session.accessToken &&
      typeof session.accessToken === 'string' &&
      session.user &&
      typeof session.user === 'object' &&
      isAuthRole((session.user as Partial<AuthUser>).role),
  );
}

export function getAuthSession() {
  const rawSession = storage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as unknown;

    return isAuthSession(parsedSession) ? parsedSession : null;
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
}

export function clearAuthSession() {
  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export function isAdminRole(role: AuthRole) {
  return ADMIN_ROLES.includes(role);
}
