import { forwardRef, type InputHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-12 w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 text-sm text-white transition',
        'placeholder:text-text-muted hover:border-white/20 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
});
