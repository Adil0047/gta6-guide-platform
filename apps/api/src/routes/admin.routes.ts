import { Router } from 'express';

import { USER_ROLES } from '@gta6-guide/shared/roles';
import { adminOverviewController } from '@/controllers/admin.controller.js';
import { requireAuth, requireRoles } from '@/middlewares/auth.middleware.js';

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRoles(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN));

adminRouter.get('/overview', adminOverviewController);
