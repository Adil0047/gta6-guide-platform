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
        'hover:-translate-y-1 hover:border-neon-pink/40 hover:bg-white/[0.06] hover:shadow-[0_12px_40px_rgba(255,60,172,0.14)]',
        className,
      )}
    >
      {/* Pink accent gradient top banner */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Hover glow ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 ring-1 ring-inset ring-neon-pink/20 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-2xl font-black tracking-tight text-white">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-text-secondary">{description}</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-neon-pink/20 bg-neon-pink/10 px-3 py-1 text-xs font-semibold text-neon-pink shadow-[0_0_16px_rgba(255,60,172,0.2)]">
          <Layers aria-hidden className="size-3.5" />
          {count}
        </span>
      </div>

      <Link
        to={`${ROUTES.categories}/${slug}`}
        className="relative mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-pink transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
