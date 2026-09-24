import { AlertTriangle, RotateCw } from 'lucide-react';
import { type ReactNode } from 'react';

import { Card } from '@/components/ui/Card';

type ErrorStateProps = {
  title?: string;
  description?: string;
  /** Optional retry affordance. When omitted, a generic retry button is shown. */
  action?: ReactNode;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again or return to the previous page.',
  action,
  onRetry,
}: ErrorStateProps) {
  return (
    <Card className="relative overflow-hidden p-8">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-danger/40 to-transparent"
      />
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
          <AlertTriangle aria-hidden className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
          {action ? (
            <div className="mt-4">{action}</div>
          ) : onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-text-secondary transition hover:border-neon-cyan/40 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <RotateCw aria-hidden className="size-3.5" />
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
