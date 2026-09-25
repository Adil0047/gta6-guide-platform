import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'card-scrim rounded-card border border-white/10 shadow-panel',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
