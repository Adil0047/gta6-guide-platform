import { Outlet } from 'react-router';

import { BackToTop, CommandPalette } from '@/components/common';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { SkipLink } from '@/components/navigation';
import { useCommandPalette, useSearchShortcut } from '@/hooks';

export function PublicLayout() {
  useSearchShortcut();
  const { open, close } = useCommandPalette();

  return (
    <div className="flex min-h-screen flex-col bg-transparent text-text-primary">
      <SkipLink />
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <BackToTop />
      <CommandPalette open={open} onClose={close} />
    </div>
  );
}
