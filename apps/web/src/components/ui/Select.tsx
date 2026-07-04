import { forwardRef, type SelectHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={cn(
        'h-12 w-full rounded-2xl border border-white/10 bg-surface px-4 text-sm text-white transition',
        'hover:border-white/20 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
