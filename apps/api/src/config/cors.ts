import { type CorsOptions } from 'cors';

import { env, isProduction } from './env.js';

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin && !isProduction) {
      callback(null, true);
      return;
    }

    const allowedOrigins = [env.CLIENT_URL];

    if (origin && allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
};
