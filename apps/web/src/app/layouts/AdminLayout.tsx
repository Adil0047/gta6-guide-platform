import { Outlet } from 'react-router';

import { AdminMobileNav, AdminSidebar } from '@/components/layout';
import { SkipLink } from '@/components/navigation';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <SkipLink />
      <div className="lg:grid lg:grid-cols-[18rem_1fr]">
        <AdminSidebar />
        <div className="min-w-0">
          <AdminMobileNav />
          <Outlet />
        </div>
      </div>
    </div>
  );
}
