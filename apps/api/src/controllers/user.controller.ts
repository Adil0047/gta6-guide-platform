import { StatusCodes } from 'http-status-codes';

import {
  getProfile,
  listUsers,
  updateProfile,
  updateUserRole,
  updateUserStatus,
} from '@/services/user.service.js';
import { createAuditLog } from '@/services/audit.service.js';
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
  const targetUserId = getRouteParam(request.params, 'id');
  const user = await updateUserRole(targetUserId, request.body.role, request.user!);

  await createAuditLog({
    actorId: request.user!.id,
    action: 'user.role.update',
    resourceType: 'user',
    resourceId: targetUserId,
    metadata: { role: request.body.role },
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'User role updated successfully',
    data: user,
  });
});

export const updateUserStatusController = asyncHandler(async (request, response) => {
  const targetUserId = getRouteParam(request.params, 'id');
  const user = await updateUserStatus(targetUserId, request.body.status, request.user!);

  await createAuditLog({
    actorId: request.user!.id,
    action: 'user.status.update',
    resourceType: 'user',
    resourceId: targetUserId,
    metadata: { status: request.body.status },
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'User status updated successfully',
    data: user,
  });
});
