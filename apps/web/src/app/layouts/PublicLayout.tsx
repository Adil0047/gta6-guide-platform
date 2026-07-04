import { Outlet } from 'react-router';

import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { SkipLink } from '@/components/navigation';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <SkipLink />
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
