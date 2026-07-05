import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { pinoHttp } from 'pino-http';

import { corsOptions } from '@/config/cors.js';
import { env, isProduction } from '@/config/env.js';
import { logger } from '@/config/logger.js';
import { errorMiddleware } from '@/middlewares/error.middleware.js';
import { mongoSanitizeMiddleware } from '@/middlewares/mongoSanitize.middleware.js';
import { notFoundMiddleware } from '@/middlewares/notFound.middleware.js';
import { globalRateLimiter } from '@/middlewares/rateLimit.middleware.js';
import { requestIdMiddleware } from '@/middlewares/requestId.middleware.js';
import { apiRouter } from '@/routes/index.js';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(requestIdMiddleware);

app.use(
  pinoHttp({
    logger,
    customProps(request) {
      return {
        requestId: request.requestId,
      };
    },
  }),
);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: isProduction ? 'same-site' : 'cross-origin',
    },
    hsts: isProduction
      ? {
          maxAge: 31_536_000,
          includeSubDomains: true,
          preload: true,
        }
      : false,
  }),
);

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser(env.COOKIE_SECRET));
app.use(mongoSanitizeMiddleware);
app.use(globalRateLimiter);

app.use(env.API_BASE_URL, apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
