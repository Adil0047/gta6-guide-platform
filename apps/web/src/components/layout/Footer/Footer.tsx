import { Github, Mail, Map, Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';
import { SITE_CONFIG } from '@/constants/site';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { label: 'Guides', href: ROUTES.guides },
      { label: 'Categories', href: ROUTES.categories },
      { label: 'Search', href: ROUTES.search },
      { label: 'Map', href: ROUTES.map },
    ],
  },
  {
    title: 'Product',
    links: [
      { label: 'Dashboard', href: ROUTES.dashboard },
      { label: 'Admin', href: ROUTES.admin },
      { label: 'Sign In', href: ROUTES.login },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/90 py-14 text-text-secondary">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Link
              to={ROUTES.home}
              className="inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="relative grid size-11 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06]">
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,60,172,0.45),transparent_35%),radial-gradient(circle_at_70%_80%,rgba(0,229,255,0.35),transparent_38%)]" />
                <span className="relative text-sm font-black tracking-tight text-white">VI</span>
              </span>
              <span>
                <span className="block text-sm font-semibold tracking-[0.24em] text-white">
                  GTA VI
                </span>
                <span className="mt-1 block text-xs font-medium tracking-[0.18em] text-text-muted">
                  GUIDE PLATFORM
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-xl text-sm leading-7">{SITE_CONFIG.description}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium">
                <ShieldCheck aria-hidden className="size-4 text-neon-cyan" />
                Production-ready frontend
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium">
                <Map aria-hidden className="size-4 text-neon-pink" />
                Map-ready architecture
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-medium">
                <Search aria-hidden className="size-4 text-neon-cyan" />
                Search-first UX
              </span>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-bold text-white">{group.title}</h2>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="rounded-full text-sm transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {SITE_CONFIG.name}. Built as a premium GTA VI guide product.</p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:team@gta6guide.local"
              className="inline-flex items-center gap-2 rounded-full transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Mail aria-hidden className="size-4" />
              Contact
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Github aria-hidden className="size-4" />
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
