import { Link } from 'react-router';

import { ROUTES } from '@/constants/routes';

export function NavbarLogo() {
  return (
    <Link
      to={ROUTES.home}
      aria-label="Go to GTA VI Guide Platform homepage"
      className="group inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="relative grid size-11 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_28px_rgba(255,60,172,0.22)]">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,60,172,0.45),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(0,229,255,0.35),transparent_38%)]" />
        <span className="relative text-sm font-black tracking-tight text-white">VI</span>
      </span>

      <span className="hidden leading-none sm:block">
        <span className="block text-sm font-semibold tracking-[0.24em] text-white">GTA VI</span>
        <span className="mt-1 block text-xs font-medium tracking-[0.18em] text-text-muted">
          GUIDE PLATFORM
        </span>
      </span>
    </Link>
  );
}
