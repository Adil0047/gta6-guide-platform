import { type HTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04]',
        className,
      )}
      aria-hidden
      {...props}
    />
  );
}
