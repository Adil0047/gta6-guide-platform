import { type NextFunction, type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { type UserRole } from '@gta6-guide/shared/roles';

import { UserModel } from '@/models/User.model.js';
import { AppError } from '@/utils/appError.js';
import { verifyAccessToken } from '@/utils/tokens.js';

function getBearerToken(request: Request) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return null;
  }

  return authorization.split(' ')[1];
}


export async function optionalAuth(request: Request, _response: Response, next: NextFunction) {
  const token = getBearerToken(request);

  if (!token) {
    next();
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await UserModel.findById(payload.sub).select('_id email username role status').lean();

    if (user?.status === 'active') {
      request.user = {
        id: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role as UserRole,
      };
    }
  } catch {
    // Public routes can still respond without an authenticated context.
  }

  next();
}

export async function requireAuth(request: Request, _response: Response, next: NextFunction) {
  const token = getBearerToken(request);

  if (!token) {
    next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await UserModel.findById(payload.sub).select('_id email username role status').lean();

    if (!user || user.status !== 'active') {
      next(new AppError('User is not authorized', StatusCodes.UNAUTHORIZED));
      return;
    }

    request.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role as UserRole,
    };

    next();
  } catch {
    next(new AppError('Invalid or expired access token', StatusCodes.UNAUTHORIZED));
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      next(new AppError('Authentication required', StatusCodes.UNAUTHORIZED));
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(new AppError('Insufficient permissions', StatusCodes.FORBIDDEN));
      return;
    }

    next();
  };
}
