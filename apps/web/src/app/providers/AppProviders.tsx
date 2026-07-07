import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from 'react';
import { RouterProvider } from 'react-router';

import { router } from '@/app/routes/router';
import { LoadingScreen } from '@/components/common';
import { ROUTES } from '@/constants/routes';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { setSessionExpiredHandler } from '@/lib/apiClient';

function createLoginRedirect() {
  if (typeof window === 'undefined') {
    return ROUTES.login;
  }

  const { pathname, search } = window.location;
  const isAuthPage = pathname === ROUTES.login || pathname === ROUTES.register;

  if (isAuthPage) {
    return ROUTES.login;
  }

  const redirectTo = encodeURIComponent(`${pathname}${search}`);

  return `${ROUTES.login}?redirectTo=${redirectTo}`;
}

export function AppProviders() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  useEffect(
    () =>
      setSessionExpiredHandler(() => {
        void router.navigate(createLoginRedirect(), { replace: true });
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Suspense fallback={<LoadingScreen />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}
