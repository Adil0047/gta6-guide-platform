import { Outlet } from 'react-router';

import { Footer, Navbar } from '@/components/layout';
import { DashboardNav } from '@/components/layout/DashboardNav';
import { Container } from '@/components/ui/Container';
import { SkipLink } from '@/components/navigation';

export function UserLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <SkipLink />
      <Navbar />
      <main id="main-content" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
            <DashboardNav />
            <Outlet />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
