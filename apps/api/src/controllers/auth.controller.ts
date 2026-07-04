import { StatusCodes } from 'http-status-codes';

import { env } from '@/config/env.js';
import {
  changePassword,
  getRefreshTokenFromSignedCookies,
  loginUser,
  logoutUser,
  refreshAuth,
  registerUser,
} from '@/services/auth.service.js';
import { asyncHandler } from '@/utils/asyncHandler.js';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '@/utils/cookies.js';
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

  clearRefreshTokenCookie(response);

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

  clearRefreshTokenCookie(response);
  response.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME);

  sendResponse({
    response,
    statusCode: StatusCodes.OK,
    message: 'Password changed successfully',
    data: { user },
  });
});
