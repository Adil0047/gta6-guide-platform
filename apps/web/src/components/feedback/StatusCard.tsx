import { type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type StatusCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export function StatusCard({ title, description, icon, className }: StatusCardProps) {
  return (
    <section
      className={cn(
        'rounded-panel border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-xl',
        className,
      )}
    >
      {icon ? <div className="mb-4 text-neon-cyan">{icon}</div> : null}
      <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </section>
  );
}
