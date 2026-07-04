import { Router } from 'express';

import { USER_ROLES } from '@gta6-guide/shared/roles';
import {
  createGuideController,
  deleteGuideController,
  getGuideByIdController,
  getGuideBySlugController,
  listGuidesController,
  updateGuideController,
} from '@/controllers/guide.controller.js';
import { optionalAuth, requireAuth, requireRoles } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  createGuideSchema,
  getGuideByIdSchema,
  getGuideBySlugSchema,
  listGuidesSchema,
  updateGuideSchema,
} from '@/validators/guide.validators.js';

export const guideRouter = Router();

guideRouter.get('/', optionalAuth, validate(listGuidesSchema), listGuidesController);
guideRouter.get('/slug/:slug', optionalAuth, validate(getGuideBySlugSchema), getGuideBySlugController);
guideRouter.get('/:id', optionalAuth, validate(getGuideByIdSchema), getGuideByIdController);

guideRouter.post(
  '/',
  requireAuth,
  requireRoles(USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(createGuideSchema),
  createGuideController,
);

guideRouter.patch(
  '/:id',
  requireAuth,
  requireRoles(USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(updateGuideSchema),
  updateGuideController,
);

guideRouter.delete(
  '/:id',
  requireAuth,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(getGuideByIdSchema),
  deleteGuideController,
);
