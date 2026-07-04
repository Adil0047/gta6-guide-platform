import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { type ZodSchema } from 'zod';

import { AppError } from '@/utils/appError.js';
import { setRequestQuery } from '@/utils/requestQuery.js';

export function validate(schema: ZodSchema) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: request.body,
      query: request.query,
      params: request.params,
    });

    if (!result.success) {
      next(new AppError('Validation failed', StatusCodes.BAD_REQUEST, result.error.flatten()));
      return;
    }

    if ('body' in result.data) {
      request.body = result.data.body;
    }

    if ('query' in result.data) {
      setRequestQuery(request, result.data.query as Request['query']);
    }

    if ('params' in result.data) {
      request.params = result.data.params;
    }

    next();
  };
}
