import { type ButtonHTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ButtonVariant = 'primary' | 'ghost' | 'icon';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-white text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] hover:bg-text-secondary focus-visible:ring-neon-pink',
  ghost:
    'bg-white/5 text-text-primary ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 focus-visible:ring-neon-cyan',
  icon:
    'bg-white/5 text-text-primary ring-1 ring-white/10 hover:bg-white/10 hover:ring-white/20 focus-visible:ring-neon-cyan',
};

export function Button({
  type = 'button',
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium transition duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'icon' ? 'size-11' : 'h-11 px-5 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
