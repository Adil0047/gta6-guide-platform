import { StatusCodes } from 'http-status-codes';

import {
  changePassword,
  getRefreshTokenFromSignedCookies,
  loginUser,
  logoutUser,
  refreshAuth,
  registerUser,
} from '@/services/auth.service.js';
import { createAuditLog } from '@/services/audit.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import {
  clearCsrfCookie,
  clearRefreshTokenCookie,
  setCsrfCookie,
  setRefreshTokenCookie,
} from '@/utils/cookies.js';
import { sendResponse } from '@/utils/apiResponse.js';

export const register = asyncHandler(async (request, response) => {
  const user = await registerUser(request.body);

  sendResponse({
    response,
    statusCode: StatusCodes.CREATED,
    message: 'User registered successfully',
    data: { user },
  });
});

export const login = asyncHandler(async (request, response) => {
  const result = await loginUser({
    ...request.body,
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  setRefreshTokenCookie(response, result.refreshToken);
  setCsrfCookie(response);

  await createAuditLog({
    actorId: result.user.id,
    action: 'auth.login',
    resourceType: 'user',
    resourceId: result.user.id,
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const refresh = asyncHandler(async (request, response) => {
  const refreshToken = getRefreshTokenFromSignedCookies(request.signedCookies);

  if (!refreshToken) {
    response.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Refresh token is missing',
    });
    return;
  }

  const result = await refreshAuth(refreshToken);

  setRefreshTokenCookie(response, result.refreshToken);
  setCsrfCookie(response);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Token refreshed successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
});

export const logout = asyncHandler(async (request, response) => {
  const refreshToken = getRefreshTokenFromSignedCookies(request.signedCookies);

  await logoutUser(refreshToken, request.ip);

  if (request.user) {
    await createAuditLog({
      actorId: request.user.id,
      action: 'auth.logout',
      resourceType: 'user',
      resourceId: request.user.id,
      ip: request.ip,
      userAgent: request.get('user-agent') ?? '',
    });
  }

  clearRefreshTokenCookie(response);
  clearCsrfCookie(response);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Logout successful',
  });
});

export const changePasswordController = asyncHandler(async (request, response) => {
  const user = await changePassword(
    request.user!.id,
    request.body.currentPassword,
    request.body.newPassword,
  );

  await createAuditLog({
    actorId: request.user!.id,
    action: 'auth.password.change',
    resourceType: 'user',
    resourceId: request.user!.id,
    ip: request.ip,
    userAgent: request.get('user-agent') ?? '',
  });

  clearRefreshTokenCookie(response);
  clearCsrfCookie(response);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Password changed successfully',
    data: { user },
  });
});
