import { type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div className={cn('mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  );
}
