import { StatusCodes } from 'http-status-codes';

import { searchGuides } from '@/services/search.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { sendResponse } from '@/utils/apiResponse.js';

export const searchController = asyncHandler(async (request, response) => {
  const result = await searchGuides(request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Search completed successfully',
    data: result.items,
    meta: result.meta,
  });
});
