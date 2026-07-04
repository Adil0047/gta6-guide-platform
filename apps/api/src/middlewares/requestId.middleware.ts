import { randomUUID } from 'node:crypto';

import { type NextFunction, type Request, type Response } from 'express';

export function requestIdMiddleware(request: Request, response: Response, next: NextFunction) {
  const requestId = request.header('X-Request-Id') ?? randomUUID();

  request.requestId = requestId;
  response.setHeader('X-Request-Id', requestId);

  next();
}
