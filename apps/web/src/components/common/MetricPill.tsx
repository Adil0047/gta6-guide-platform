import { type ReactNode } from 'react';

type MetricPillProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

export function MetricPill({ icon, label, value }: MetricPillProps) {
  return (
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2">
      <span className="text-neon-cyan">{icon}</span>
      <span>
        <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
          {label}
        </span>
        <span className="block text-sm font-bold text-white">{value}</span>
      </span>
    </div>
  );
}
