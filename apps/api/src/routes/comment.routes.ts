import { Router } from 'express';

import { USER_ROLES } from '@gta6-guide/shared/roles';
import {
  createCommentController,
  deleteCommentController,
  listCommentsController,
  listGuideCommentsController,
  listMyCommentsController,
  updateCommentController,
  updateCommentStatusController,
} from '@/controllers/comment.controller.js';
import { requireAuth, requireRoles } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  createCommentSchema,
  deleteCommentSchema,
  guideCommentsSchema,
  listCommentsSchema,
  updateCommentSchema,
  updateCommentStatusSchema,
} from '@/validators/comment.validators.js';

export const commentRouter = Router();

commentRouter.get('/guide/:guideId', validate(guideCommentsSchema), listGuideCommentsController);
commentRouter.post('/', requireAuth, validate(createCommentSchema), createCommentController);
commentRouter.get('/me', requireAuth, validate(listCommentsSchema), listMyCommentsController);
commentRouter.get(
  '/',
  requireAuth,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(listCommentsSchema),
  listCommentsController,
);
commentRouter.patch('/:id', requireAuth, validate(updateCommentSchema), updateCommentController);
commentRouter.patch(
  '/:id/status',
  requireAuth,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(updateCommentStatusSchema),
  updateCommentStatusController,
);
commentRouter.delete('/:id', requireAuth, validate(deleteCommentSchema), deleteCommentController);
