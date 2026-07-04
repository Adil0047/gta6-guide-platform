import { forwardRef, type TextareaHTMLAttributes } from 'react';

import { cn } from '@/utils/cn';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, rows = 5, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        'w-full resize-y rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white transition',
        'placeholder:text-text-muted hover:border-white/20 focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/30',
        'disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
});
