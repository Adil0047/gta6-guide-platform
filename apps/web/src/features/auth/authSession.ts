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

type AuthSessionListener = (session: AuthSession | null) => void;

const AUTH_SESSION_STORAGE_KEY = 'gta6-guide-auth-user';
const CSRF_COOKIE_NAME = 'gta6_csrf_token';

let accessTokenMemory: string | null = null;
const listeners = new Set<AuthSessionListener>();

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

function getCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  return document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`))
    ?.split('=')[1] ?? null;
}

function emitAuthSessionChange() {
  const session = getAuthSession();

  listeners.forEach((listener) => {
    listener(session);
  });
}

export function subscribeAuthSession(listener: AuthSessionListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function getAccessToken() {
  return accessTokenMemory;
}

export function setAccessToken(accessToken: string | null) {
  accessTokenMemory = accessToken;
  emitAuthSessionChange();
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

export function shouldRestoreAuthSession() {
  return Boolean(getAuthSession() || getCookie(CSRF_COOKIE_NAME));
}

export function setAuthSession(session: AuthSessionDto) {
  accessTokenMemory = session.accessToken;
  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session.user));
  emitAuthSessionChange();
}

export function updateAuthSessionUser(user: AuthUser) {
  if (!getAuthSession()) {
    return;
  }

  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(user));
  emitAuthSessionChange();
}

export function clearAuthSession() {
  accessTokenMemory = null;
  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
  emitAuthSessionChange();
}

export function isAdminRole(role: AuthRole) {
  return ADMIN_ROLES.includes(role);
}
