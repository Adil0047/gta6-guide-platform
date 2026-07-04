import { cn } from '@/utils/cn';

type SpinnerProps = {
  className?: string;
  label?: string;
};

export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex items-center', className)}>
      <span className="size-5 animate-spin rounded-full border-2 border-white/20 border-t-neon-cyan" />
    </span>
  );
}
