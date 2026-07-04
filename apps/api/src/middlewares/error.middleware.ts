import { type ApiErrorResponse } from '@gta6-guide/shared/api';
import { type ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import { ZodError } from 'zod';

import { isProduction } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import { AppError } from '@/utils/appError.js';

export const errorMiddleware: ErrorRequestHandler = (error, request, response, _next) => {
  void _next;

  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let details: unknown = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation failed';
    details = error.flatten();
  } else if (error instanceof mongoose.Error.ValidationError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Database validation failed';
    details = error.errors;
  } else if (error instanceof mongoose.Error.CastError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Invalid resource identifier';
  } else if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  ) {
    statusCode = StatusCodes.CONFLICT;
    message = 'Duplicate resource';
    details = 'keyValue' in error ? error.keyValue : undefined;
  } else if (error instanceof Error) {
    message = error.message || message;
  }

  logger.error(
    {
      err: error,
      requestId: request.requestId,
      path: request.originalUrl,
      method: request.method,
    },
    message,
  );

  const payload: ApiErrorResponse = {
    success: false,
    message,
    details,
    requestId: request.requestId,
    stack: isProduction ? undefined : error instanceof Error ? error.stack : undefined,
  };

  response.status(statusCode).json(payload);
};
