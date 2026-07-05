import { Router } from 'express';

import {
  createCategoryController,
  deleteCategoryController,
  getCategoryByIdController,
  getCategoryBySlugController,
  listCategoriesController,
  updateCategoryController,
} from '@/controllers/category.controller.js';
import { optionalAuth, requireAuth, requireRoles } from '@/middlewares/auth.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { USER_ROLES } from '@gta6-guide/shared/roles';
import {
  createCategorySchema,
  getCategoryByIdSchema,
  getCategoryBySlugSchema,
  listCategoriesSchema,
  updateCategorySchema,
} from '@/validators/category.validators.js';

export const categoryRouter = Router();

categoryRouter.get('/', optionalAuth, validate(listCategoriesSchema), listCategoriesController);
categoryRouter.get('/slug/:slug', optionalAuth, validate(getCategoryBySlugSchema), getCategoryBySlugController);
categoryRouter.get('/:id', optionalAuth, validate(getCategoryByIdSchema), getCategoryByIdController);

categoryRouter.post(
  '/',
  requireAuth,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(createCategorySchema),
  createCategoryController,
);

categoryRouter.patch(
  '/:id',
  requireAuth,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(updateCategorySchema),
  updateCategoryController,
);

categoryRouter.delete(
  '/:id',
  requireAuth,
  requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validate(getCategoryByIdSchema),
  deleteCategoryController,
);
