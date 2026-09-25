import { Outlet } from 'react-router';

import { CommandPalette } from '@/components/common';
import { AdminMobileNav, AdminSidebar } from '@/components/layout';
import { SkipLink } from '@/components/navigation';
import { useCommandPalette, useContextCommands } from '@/hooks';

export function AdminLayout() {
  const { open, close } = useCommandPalette();
  const extraCommands = useContextCommands('admin', close);

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-primary">
      <SkipLink />
      <div className="flex-1 lg:grid lg:grid-cols-[18rem_1fr]">
        <AdminSidebar />
        <div className="min-w-0">
          <AdminMobileNav />
          <Outlet />
        </div>
      </div>
      <CommandPalette open={open} onClose={close} extraCommands={extraCommands} />
    </div>
  );
}
