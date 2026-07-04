import {
  type AuthSessionDto,
  type LoginRequestDto,
  type RegisterRequestDto,
  type RegisterResponseDto,
} from '@gta6-guide/shared/dto';

import { setAuthSession } from '@/features/auth/authSession';
import { apiClient } from '@/lib/apiClient';

export const authService = {
  async login(input: LoginRequestDto) {
    const session = await apiClient.post<AuthSessionDto>('/auth/login', input);
    setAuthSession(session);

    return session;
  },

  async register(input: RegisterRequestDto) {
    return apiClient.post<RegisterResponseDto>('/auth/register', input);
  },

  async refresh() {
    const session = await apiClient.post<AuthSessionDto>('/auth/refresh');
    setAuthSession(session);

    return session;
  },
};
