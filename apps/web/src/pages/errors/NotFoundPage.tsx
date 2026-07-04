import { Compass } from 'lucide-react';
import { Link } from 'react-router';

import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <>
      <SEO title="Page Not Found" description="The requested GTA VI Guide Platform page was not found." />
      <main className="flex min-h-screen items-center bg-background text-text-primary">
        <Container>
          <div className="max-w-xl">
            <div className="grid size-14 place-items-center rounded-3xl border border-neon-pink/20 bg-neon-pink/10 text-neon-pink">
              <Compass aria-hidden className="size-7" />
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">404</p>
            <h1 className="mt-5 text-5xl font-black tracking-tight text-white">Page not found</h1>
            <p className="mt-5 text-base leading-8 text-text-secondary">
              The page you requested does not exist, has moved, or is not available in this route structure.
            </p>
            <Link
              to={ROUTES.home}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Return home
            </Link>
          </div>
        </Container>
      </main>
    </>
  );
}
