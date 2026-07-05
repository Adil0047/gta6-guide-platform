import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env.js';
import { AppError } from '@/utils/appError.js';

export function requireCsrfToken(request: Request, _response: Response, next: NextFunction) {
  const headerToken = request.get('x-csrf-token');
  const cookieToken = request.cookies[env.CSRF_COOKIE_NAME];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    next(new AppError('CSRF token validation failed', StatusCodes.FORBIDDEN));
    return;
  }

  next();
}
