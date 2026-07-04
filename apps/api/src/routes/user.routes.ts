import { Router } from 'express';

import {
  getMeController,
  listUsersController,
  updateMeController,
  updateUserRoleController,
  updateUserStatusController,
} from '@/controllers/user.controller.js';
import { USER_ROLES } from '@gta6-guide/shared/roles';
import { requireAuth, requireRoles } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import {
  listUsersSchema,
  updateProfileSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
} from '@/validators/user.validators.js';

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.get('/me', getMeController);
userRouter.patch('/me', validate(updateProfileSchema), updateMeController);

userRouter.get(
  '/',
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(listUsersSchema),
  listUsersController,
);

userRouter.patch(
  '/:id/role',
  requireRoles(USER_ROLES.SUPER_ADMIN),
  validate(updateUserRoleSchema),
  updateUserRoleController,
);

userRouter.patch(
  '/:id/status',
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(updateUserStatusSchema),
  updateUserStatusController,
);
