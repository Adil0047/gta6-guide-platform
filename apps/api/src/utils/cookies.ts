import { type Response } from 'express';

import { env, isProduction } from '@/config/env.js';

export function setRefreshTokenCookie(response: Response, token: string) {
  response.cookie(env.REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    signed: true,
    path: '/api/v1/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearRefreshTokenCookie(response: Response) {
  response.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    signed: true,
    path: '/api/v1/auth',
  });
}
