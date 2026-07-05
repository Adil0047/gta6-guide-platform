import { randomBytes } from 'node:crypto';

import { type Response } from 'express';

import { env, isProduction } from '@/config/env.js';

const refreshCookiePath = `${env.API_BASE_URL}/auth`;

export function createCsrfToken() {
  return randomBytes(32).toString('hex');
}

export function setCsrfCookie(response: Response, token = createCsrfToken()) {
  response.cookie(env.CSRF_COOKIE_NAME, token, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
}

export function clearCsrfCookie(response: Response) {
  response.clearCookie(env.CSRF_COOKIE_NAME, {
    httpOnly: false,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });
}

export function setRefreshTokenCookie(response: Response, token: string) {
  response.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    signed: true,
    path: refreshCookiePath,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshTokenCookie(response: Response) {
  response.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    signed: true,
    path: refreshCookiePath,
  });
}
