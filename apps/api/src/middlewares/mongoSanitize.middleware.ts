import { type NextFunction, type Request, type Response } from 'express';

import { setRequestQuery } from '@/utils/requestQuery.js';

const UNSAFE_MONGO_KEY_PATTERN = /[$.]/u;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function sanitizeMongoValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeMongoValue(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  const sanitizedValue: Record<string, unknown> = {};

  for (const [key, nestedValue] of Object.entries(value)) {
    if (UNSAFE_MONGO_KEY_PATTERN.test(key)) {
      continue;
    }

    sanitizedValue[key] = sanitizeMongoValue(nestedValue);
  }

  return sanitizedValue;
}

export function mongoSanitizeMiddleware(request: Request, _response: Response, next: NextFunction) {
  request.body = sanitizeMongoValue(request.body);
  request.params = sanitizeMongoValue(request.params) as Request['params'];
  setRequestQuery(request, sanitizeMongoValue(request.query) as Request['query']);

  next();
}
