import { type UpdateProfileDto, type UserDto } from '@gta6-guide/shared/dto';

import { getAuthOptions } from '@/services/authHeaders';
import { apiClient } from '@/lib/apiClient';

export const userService = {
  getMe() {
    return apiClient.get<UserDto>('/users/me', getAuthOptions());
  },

  updateMe(input: UpdateProfileDto) {
    return apiClient.patch<UserDto>('/users/me', input, getAuthOptions());
  },
};
