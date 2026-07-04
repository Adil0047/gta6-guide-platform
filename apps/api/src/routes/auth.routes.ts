import { Router } from 'express';

import {
  changePasswordController,
  login,
  logout,
  refresh,
  register,
} from '@/controllers/auth.controller.js';
import { requireAuth } from '@/middlewares/auth.middleware.js';
import { authRateLimiter } from '@/middlewares/rateLimit.middleware.js';
import { validate } from '@/middlewares/validate.middleware.js';
import { changePasswordSchema, loginSchema, registerSchema } from '@/validators/auth.validators.js';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, validate(registerSchema), register);
authRouter.post('/login', authRateLimiter, validate(loginSchema), login);
authRouter.post('/refresh', authRateLimiter, refresh);
authRouter.post('/logout', logout);
authRouter.post('/change-password', requireAuth, validate(changePasswordSchema), changePasswordController);
