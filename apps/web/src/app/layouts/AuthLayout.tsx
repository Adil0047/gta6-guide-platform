import { Outlet } from 'react-router';

import { SkipLink } from '@/components/navigation';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <SkipLink />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
