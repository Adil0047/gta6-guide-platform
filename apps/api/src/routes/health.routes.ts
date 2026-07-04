import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { sendResponse } from '@/utils/apiResponse.js';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'API server is healthy',
    data: {
      service: 'gta6-guide-api',
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
  });
});
