import { StatusCodes } from 'http-status-codes';

import {
  getProfile,
  listUsers,
  updateProfile,
  updateUserRole,
  updateUserStatus,
} from '@/services/user.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { sendResponse } from '@/utils/apiResponse.js';
import { getRouteParam } from '@/utils/routeParams.js';

export const getMeController = asyncHandler(async (request, response) => {
  const user = await getProfile(request.user!.id);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Profile retrieved successfully',
    data: user,
  });
});

export const updateMeController = asyncHandler(async (request, response) => {
  const user = await updateProfile(request.user!.id, request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: user,
  });
});

export const listUsersController = asyncHandler(async (request, response) => {
  const result = await listUsers(request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Users retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const updateUserRoleController = asyncHandler(async (request, response) => {
  const user = await updateUserRole(getRouteParam(request.params, 'id'), request.body.role);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'User role updated successfully',
    data: user,
  });
});

export const updateUserStatusController = asyncHandler(async (request, response) => {
  const user = await updateUserStatus(getRouteParam(request.params, 'id'), request.body.status);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'User status updated successfully',
    data: user,
  });
});
