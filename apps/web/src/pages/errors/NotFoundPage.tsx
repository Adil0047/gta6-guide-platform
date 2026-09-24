import { Compass, Home, Map, BookOpen, Layers } from 'lucide-react';
import { Link } from 'react-router';

import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';

const RECOVERY_LINKS = [
  {
    icon: BookOpen,
    label: 'Browse guides',
    description: 'Mission, vehicle, money, and secrets walkthroughs',
    href: ROUTES.guides,
    accent: 'cyan' as const,
  },
  {
    icon: Layers,
    label: 'Explore categories',
    description: 'Guides grouped by gameplay system',
    href: ROUTES.categories,
    accent: 'pink' as const,
  },
  {
    icon: Map,
    label: 'Open the map',
    description: 'Interactive Vice City location architecture',
    href: ROUTES.map,
    accent: 'purple' as const,
  },
];

const accentMap = {
  cyan: 'border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan',
  pink: 'border-neon-pink/20 bg-neon-pink/10 text-neon-pink',
  purple: 'border-neon-purple/20 bg-neon-purple/10 text-neon-purple',
};

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center bg-background text-text-primary">
      <Container>
        <div className="max-w-2xl">
          <div className="grid size-14 place-items-center rounded-3xl border border-neon-pink/20 bg-neon-pink/10 text-neon-pink">
            <Compass aria-hidden className="size-7" />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">404</p>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-white sm:text-6xl">Page not found</h1>
          <p className="mt-5 text-base leading-8 text-text-secondary">
            The page you requested does not exist, has moved, or is not available in this route
            structure. Try one of these popular destinations instead.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {RECOVERY_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-white/20 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span
                    className={`inline-grid size-9 place-items-center rounded-xl border ${accentMap[link.accent]}`}
                  >
                    <Icon aria-hidden className="size-4" />
                  </span>
                  <span className="mt-3 block text-sm font-bold text-white">{link.label}</span>
                  <span className="mt-1 block text-xs leading-5 text-text-muted">{link.description}</span>
                </Link>
              );
            })}
          </div>

          <Link
            to={ROUTES.home}
            className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Home aria-hidden className="size-4" />
            Return home
          </Link>
        </div>
      </Container>
    </main>
  );
}
