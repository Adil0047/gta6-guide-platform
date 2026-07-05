import { getAccessToken } from '@/features/auth/authSession';

export function getAuthOptions() {
  const accessToken = getAccessToken();

  return {
    authToken: accessToken ?? undefined,
    requiresAuth: true,
  };
}
