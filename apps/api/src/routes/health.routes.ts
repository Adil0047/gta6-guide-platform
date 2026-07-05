import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

import { sendResponse } from '@/utils/apiResponse.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  const isDatabaseConnected = mongoose.connection.readyState === 1;

  sendResponse({
    response,
    statusCode: isDatabaseConnected ? StatusCodes.OK : StatusCodes.SERVICE_UNAVAILABLE,
    message: isDatabaseConnected ? 'API server is healthy' : 'API server is not ready',
    data: {
      service: 'gta6-guide-api',
      status: isDatabaseConnected ? 'ok' : 'degraded',
      database: isDatabaseConnected ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    },
  });
});
