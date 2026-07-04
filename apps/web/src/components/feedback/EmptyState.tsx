import { type ReactNode } from 'react';

import { Card } from '@/components/ui/Card';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="p-8 text-center">
      {icon ? <div className="mx-auto mb-5 flex justify-center text-neon-cyan">{icon}</div> : null}
      <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-text-secondary">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}
