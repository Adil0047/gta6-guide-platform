import { StatusCodes } from 'http-status-codes';

import {
  createBookmark,
  deleteBookmark,
  getBookmarkStatus,
  listBookmarks,
} from '@/services/bookmark.service.js';
import { sendResponse } from '@/utils/apiResponse.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { getRouteParam } from '@/utils/routeParams.js';

export const listBookmarksController = asyncHandler(async (request, response) => {
  const result = await listBookmarks(request.user!.id, request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Bookmarks retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const getBookmarkStatusController = asyncHandler(async (request, response) => {
  const status = await getBookmarkStatus(request.user!.id, getRouteParam(request.params, 'guideId'));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Bookmark status retrieved successfully',
    data: status,
  });
});

export const createBookmarkController = asyncHandler(async (request, response) => {
  const bookmark = await createBookmark(request.user!.id, request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.CREATED,
    message: 'Bookmark saved successfully',
    data: bookmark,
  });
});

export const deleteBookmarkController = asyncHandler(async (request, response) => {
  const bookmark = await deleteBookmark(request.user!.id, getRouteParam(request.params, 'guideId'));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Bookmark removed successfully',
    data: bookmark,
  });
});
