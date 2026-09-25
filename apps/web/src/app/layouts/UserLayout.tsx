import { Outlet } from 'react-router';

import { CommandPalette } from '@/components/common';
import { Footer, Navbar } from '@/components/layout';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { Container } from '@/components/ui/Container';
import { SkipLink } from '@/components/navigation';
import { useCommandPalette, useContextCommands, useSearchShortcut } from '@/hooks';

export function UserLayout() {
  useSearchShortcut();
  const { open, close } = useCommandPalette();
  const extraCommands = useContextCommands('dashboard', close);

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-primary">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="flex-1 py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
            <DashboardNav />
            <Outlet />
          </div>
        </Container>
      </main>
      <Footer />
      <CommandPalette open={open} onClose={close} extraCommands={extraCommands} />
    </div>
  );
}
