import { AlertTriangle } from 'lucide-react';

import { Card } from '@/components/ui/Card';

type ErrorStateProps = {
  title?: string;
  description?: string;
};

export function ErrorState({
  title = 'Something went wrong',
  description = 'Please try again or return to the previous page.',
}: ErrorStateProps) {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-danger/30 bg-danger/10 text-danger">
          <AlertTriangle aria-hidden className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
        </div>
      </div>
    </Card>
  );
}
