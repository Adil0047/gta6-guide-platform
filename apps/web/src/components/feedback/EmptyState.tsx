import { type ReactNode } from 'react';

import { Card } from '@/components/ui/Card';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="relative overflow-hidden p-8 text-center">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      {icon ? (
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-neon-cyan">
          {icon}
        </div>
      ) : null}
      <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-secondary">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}
