import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-card border border-white/10 bg-white/[0.04] shadow-panel backdrop-blur-xl',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
