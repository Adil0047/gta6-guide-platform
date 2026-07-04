import { type Request, type Response, type NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AppError } from '@/utils/appError.js';

export function notFoundMiddleware(request: Request, _response: Response, next: NextFunction) {
  next(new AppError(`Route not found: ${request.method} ${request.originalUrl}`, StatusCodes.NOT_FOUND));
}
