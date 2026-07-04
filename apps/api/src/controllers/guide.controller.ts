import { isEditorRole } from '@gta6-guide/shared/roles';
import { StatusCodes } from 'http-status-codes';

import {
  createGuide,
  deleteGuide,
  getGuideById,
  getGuideBySlug,
  incrementGuideView,
  listGuides,
  updateGuide,
} from '@/services/guide.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { sendResponse } from '@/utils/apiResponse.js';
import { getRouteParam } from '@/utils/routeParams.js';

export const listGuidesController = asyncHandler(async (request, response) => {
  const includeDrafts = Boolean(request.user && isEditorRole(request.user.role));
  const result = await listGuides(request.query, includeDrafts);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Guides retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const getGuideByIdController = asyncHandler(async (request, response) => {
  const includeDrafts = Boolean(request.user && isEditorRole(request.user.role));
  const guide = await getGuideById(getRouteParam(request.params, 'id'), includeDrafts);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Guide retrieved successfully',
    data: guide,
  });
});

export const getGuideBySlugController = asyncHandler(async (request, response) => {
  const includeDrafts = Boolean(request.user && isEditorRole(request.user.role));
  const guide = await getGuideBySlug(getRouteParam(request.params, 'slug'), includeDrafts);

  if (!includeDrafts) {
    await incrementGuideView(getRouteParam(request.params, 'slug'));
  }

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Guide retrieved successfully',
    data: guide,
  });
});

export const createGuideController = asyncHandler(async (request, response) => {
  const guide = await createGuide(request.body, request.user!.id);

  sendResponse({
    response,
    statusCode: StatusCodes.CREATED,
    message: 'Guide created successfully',
    data: guide,
  });
});

export const updateGuideController = asyncHandler(async (request, response) => {
  const guide = await updateGuide(getRouteParam(request.params, 'id'), request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Guide updated successfully',
    data: guide,
  });
});

export const deleteGuideController = asyncHandler(async (request, response) => {
  const guide = await deleteGuide(getRouteParam(request.params, 'id'));

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Guide deleted successfully',
    data: guide,
  });
});
