import { Outlet } from 'react-router';

import { SkipLink } from '@/components/navigation';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <SkipLink />
      <Outlet />
    </div>
  );
}
