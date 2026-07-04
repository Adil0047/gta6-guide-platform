import { type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        action ? 'sm:flex-row sm:items-end sm:justify-between' : '',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : '',
        className,
      )}
    >
      <div className={cn(align === 'center' ? 'mx-auto' : '')}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan">
          {eyebrow}
        </p>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{title}</h2>
        {description ? (
          <p className="mt-4 max-w-2xl text-sm leading-7 text-text-secondary">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
