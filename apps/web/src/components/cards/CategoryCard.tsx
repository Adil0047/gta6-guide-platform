import { ArrowUpRight, Layers } from 'lucide-react';
import { Link } from 'react-router';

import { Card } from '@/components/ui/Card';
import { ROUTES } from '@/constants/routes';
import { cn } from '@/utils/cn';

type CategoryCardProps = {
  title: string;
  slug: string;
  description: string;
  count: number;
  className?: string;
};

export function CategoryCard({ title, slug, description, count, className }: CategoryCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden p-6 transition duration-300',
        'hover:border-neon-pink/40 hover:bg-white/[0.06] hover:shadow-[0_8px_32px_rgba(255,60,172,0.10)]',
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-pink/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{description}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neon-pink/20 bg-neon-pink/10 px-3 py-1 text-xs font-semibold text-neon-pink">
          <Layers aria-hidden className="size-3.5" />
          {count}
        </span>
      </div>

      <Link
        to={`${ROUTES.categories}/${slug}`}
        className="mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-pink transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        View category
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </Card>
  );
}
