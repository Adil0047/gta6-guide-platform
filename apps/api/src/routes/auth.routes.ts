import { Router } from 'express';

import {
  changePasswordController,
  login,
  logout,
  refresh,
  register,
} from '@/controllers/auth.controller.js';
import { optionalAuth, requireAuth } from '@/middlewares/auth.middleware.js';
import { requireCsrfToken } from '@/middlewares/csrf.middleware.js';
import { authRateLimiter } from '@/middlewares/rateLimit.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { changePasswordSchema, loginSchema, registerSchema } from '@/validators/auth.validators.js';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, validate(registerSchema), register);
authRouter.post('/login', authRateLimiter, validate(loginSchema), login);
authRouter.post('/refresh', authRateLimiter, requireCsrfToken, refresh);
authRouter.post('/logout', optionalAuth, requireCsrfToken, logout);
authRouter.post('/change-password', requireAuth, requireCsrfToken, validate(changePasswordSchema), changePasswordController);
