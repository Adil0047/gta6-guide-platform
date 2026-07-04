import { type Request } from 'express';

export function setRequestQuery(request: Request, query: Request['query']) {
  Object.defineProperty(request, 'query', {
    value: query,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
