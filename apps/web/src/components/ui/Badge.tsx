import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type BadgeVariant = 'neutral' | 'pink' | 'cyan' | 'purple';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  children: ReactNode;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-white/10 bg-white/[0.06] text-text-secondary',
  pink: 'border-neon-pink/30 bg-neon-pink/10 text-neon-pink',
  cyan: 'border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan',
  purple: 'border-neon-purple/30 bg-neon-purple/10 text-white',
};

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
