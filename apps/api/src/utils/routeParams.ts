import { StatusCodes } from 'http-status-codes';

import { AppError } from './appError.js';

type RouteParams = Record<string, string | string[] | undefined>;

export function getRouteParam(params: RouteParams, key: string) {
  const value = params[key];

  if (typeof value === 'string') {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === 'string') {
    return value[0];
  }

  throw new AppError(`Missing route parameter: ${key}`, StatusCodes.BAD_REQUEST);
}
