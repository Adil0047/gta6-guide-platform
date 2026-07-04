import { StatCard } from '@/components/cards';
import { type DashboardStat } from '@/types/dashboard';

type AdminStatGridProps = {
  stats: DashboardStat[];
};

export function AdminStatGrid({ stats }: AdminStatGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          label={stat.label}
          value={stat.value}
          description={stat.description}
          icon={<stat.icon aria-hidden className="size-5" />}
        />
      ))}
    </div>
  );
}
