import { type ReactNode } from 'react';
import { Link } from 'react-router';

import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({ eyebrow, title, description, children, footer }: AuthCardProps) {
  return (
    <main id="main-content" className="flex min-h-screen items-center py-16">
      <Container className="max-w-xl">
        <Link
          to={ROUTES.home}
          className="inline-flex rounded-full text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to platform
        </Link>

        <section className="mt-8 rounded-panel border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white">{title}</h1>
          <p className="mt-4 text-sm leading-6 text-text-secondary">{description}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 border-t border-white/10 pt-6 text-sm text-text-secondary">{footer}</div>
        </section>
      </Container>
    </main>
  );
}
