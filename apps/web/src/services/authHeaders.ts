import { getAuthSession } from '@/features/auth/authSession';

export function getAuthOptions() {
  const session = getAuthSession();

  return session?.accessToken ? { authToken: session.accessToken } : undefined;
}
