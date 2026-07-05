import {
  type AuthSessionDto,
  type LoginRequestDto,
  type RegisterRequestDto,
  type RegisterResponseDto,
} from '@gta6-guide/shared/dto';

import { clearAuthSession, setAuthSession } from '@/features/auth/authSession';
import { apiClient } from '@/lib/apiClient';

export const authService = {
  async login(input: LoginRequestDto) {
    const session = await apiClient.post<AuthSessionDto>('/auth/login', input, {
      retryOnUnauthorized: false,
    });
    setAuthSession(session);

    return session;
  },

  async register(input: RegisterRequestDto) {
    return apiClient.post<RegisterResponseDto>('/auth/register', input, {
      retryOnUnauthorized: false,
    });
  },

  async refresh() {
    const session = await apiClient.post<AuthSessionDto>('/auth/refresh', undefined, {
      retryOnUnauthorized: false,
    });
    setAuthSession(session);

    return session;
  },

  async logout() {
    try {
      await apiClient.post<unknown>('/auth/logout', undefined, {
        retryOnUnauthorized: false,
      });
    } finally {
      clearAuthSession();
    }
  },
};
