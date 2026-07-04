import { type ReactNode } from 'react';

import { Card } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

type StatCardProps = {
  label: string;
  value: string;
  description: string;
  icon?: ReactNode;
  className?: string;
};

export function StatCard({ label, value, description, icon, className }: StatCardProps) {
  return (
    <Card className={cn('p-6', className)}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">{label}</p>
        {icon ? <div className="text-neon-cyan">{icon}</div> : null}
      </div>
      <p className="mt-5 text-4xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{description}</p>
    </Card>
  );
}
