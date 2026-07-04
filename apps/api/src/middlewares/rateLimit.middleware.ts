import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env.js';

export const globalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: StatusCodes.TOO_MANY_REQUESTS,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});
