import { type ReactNode } from 'react';

import { Container } from '@/components/ui/Container';

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ eyebrow, title, description, children }: PageShellProps) {
  return (
    <main className="min-h-[calc(100vh-5rem)] py-16 sm:py-20">
      <Container>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan">{eyebrow}</p>
          <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-8 text-text-secondary sm:text-lg">{description}</p>
        </div>
        {children ? <div className="mt-12">{children}</div> : null}
      </Container>
    </main>
  );
}
