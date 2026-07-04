import { ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

type GuideCardProps = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readTime: string;
  className?: string;
};

export function GuideCard({ title, slug, excerpt, category, readTime, className }: GuideCardProps) {
  return (
    <Card
      className={cn(
        'group overflow-hidden p-6 transition duration-300 hover:border-neon-cyan/40 hover:bg-white/[0.06]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Badge variant="cyan">{category}</Badge>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-text-muted">
          <Clock aria-hidden className="size-4" />
          {readTime}
        </span>
      </div>

      <h2 className="mt-6 text-2xl font-black tracking-tight text-white">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-text-secondary">{excerpt}</p>

      <Link
        to={`${ROUTES.guides}/${slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Read guide
        <ArrowUpRight aria-hidden className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </Card>
  );
}
