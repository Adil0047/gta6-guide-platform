import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { RouterProvider } from 'react-router';

import { router } from '@/app/routes/router';
import { LoadingScreen } from '@/components/common';

export function AppProviders() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingScreen />}>
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}
