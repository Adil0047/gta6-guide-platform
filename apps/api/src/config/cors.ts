import { type CorsOptions } from 'cors';

import { env, isProduction } from './env.js';

function parseAllowedOrigins() {
  const extraOrigins = env.CLIENT_URLS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return Array.from(new Set([env.CLIENT_URL, ...extraOrigins]));
}

export const allowedOrigins = parseAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, !isProduction);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-Id'],
  exposedHeaders: ['X-Request-Id', 'RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
  maxAge: 86_400,
};
