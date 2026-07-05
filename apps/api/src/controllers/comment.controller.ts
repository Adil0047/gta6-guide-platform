import { StatusCodes } from 'http-status-codes';

import {
  createComment,
  deleteComment,
  listComments,
  listGuideComments,
  listMyComments,
  updateComment,
  updateCommentStatus,
} from '@/services/comment.service.js';
import { createAuditLog } from '@/services/audit.service.js';
import { sendResponse } from '@/utils/apiResponse.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { getRouteParam } from '@/utils/routeParams.js';

export const listCommentsController = asyncHandler(async (request, response) => {
  const result = await listComments(request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Comments retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const listGuideCommentsController = asyncHandler(async (request, response) => {
  const result = await listGuideComments(getRouteParam(request.params, 'guideId'), request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Guide comments retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const listMyCommentsController = asyncHandler(async (request, response) => {
  const result = await listMyComments(request.user!.id, request.query);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'User comments retrieved successfully',
    data: result.items,
    meta: result.meta,
  });
});

export const createCommentController = asyncHandler(async (request, response) => {
  const comment = await createComment(request.user!.id, request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.CREATED,
    message: 'Comment submitted successfully',
    data: comment,
  });
});

export const updateCommentController = asyncHandler(async (request, response) => {
  const comment = await updateComment(getRouteParam(request.params, 'id'), request.user!, request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Comment updated successfully',
    data: comment,
  });
});

export const updateCommentStatusController = asyncHandler(async (request, response) => {
  const commentId = getRouteParam(request.params, 'id');
  const comment = await updateCommentStatus(commentId, request.body.status);

  await createAuditLog({
    actorId: request.user!.id,
    action: 'comment.status.update',
    resourceType: 'comment',
    resourceId: commentId,
    metadata: { status: request.body.status },
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Comment status updated successfully',
    data: comment,
  });
});

export const deleteCommentController = asyncHandler(async (request, response) => {
  const commentId = getRouteParam(request.params, 'id');
  const comment = await deleteComment(commentId, request.user!);

  if (request.user!.role === 'admin' || request.user!.role === 'superAdmin') {
    await createAuditLog({
      actorId: request.user!.id,
      action: 'comment.delete',
      resourceType: 'comment',
      resourceId: commentId,
      metadata: { guideId: comment.guideId },
      ip: request.ip,
      userAgent: request.get('user-agent') ?? '',
    });
  }

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Comment deleted successfully',
    data: comment,
  });
});
