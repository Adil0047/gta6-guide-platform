import { BarChart3 } from 'lucide-react';

import { Card } from '@/components/ui/Card';

type AdminAnalyticsPanelProps = {
  stats: {
    guideCount: number;
    publishedGuideCount: number;
    categoryCount: number;
    userCount: number;
  };
};

function createPercent(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }

  return Math.min(Math.round((value / max) * 100), 100);
}

export function AdminAnalyticsPanel({ stats }: AdminAnalyticsPanelProps) {
  const maxValue = Math.max(stats.guideCount, stats.categoryCount, stats.userCount, 1);
  const analyticsBars = [
    { label: 'All guide records', value: createPercent(stats.guideCount, maxValue) },
    { label: 'Published guides', value: createPercent(stats.publishedGuideCount, maxValue) },
    { label: 'Categories', value: createPercent(stats.categoryCount, maxValue) },
    { label: 'Users', value: createPercent(stats.userCount, maxValue) },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
          <BarChart3 aria-hidden className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">Backend content signals</h2>
          <p className="text-sm text-text-muted">Live ratios from the admin overview endpoint.</p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {analyticsBars.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="font-semibold text-white">{item.label}</span>
              <span className="text-text-muted">{item.value}%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-neon-pink to-neon-cyan"
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
