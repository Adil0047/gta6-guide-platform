import { ArrowUpRight, Clock, Flame } from 'lucide-react';
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
  featured?: boolean;
  className?: string;
};

export function GuideCard({
  title,
  slug,
  excerpt,
  category,
  readTime,
  featured = false,
  className,
}: GuideCardProps) {
  return (
    <Card
      className={cn(
        'shimmer-on-hover group relative overflow-hidden p-6 transition duration-300',
        'hover:-translate-y-1 hover:border-neon-cyan/40 hover:bg-white/[0.06] hover:shadow-[0_12px_40px_rgba(0,229,255,0.14)]',
        featured ? 'border-neon-pink/30' : '',
        className,
      )}
    >
      {/* Category-accent gradient top banner — cyan by default, pink when featured */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r transition-opacity duration-300',
          featured
            ? 'from-transparent via-neon-pink to-transparent opacity-80'
            : 'from-transparent via-neon-cyan to-transparent opacity-60',
          'group-hover:opacity-100',
        )}
      />
      {/* Hover glow ring — subtle neon halo on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 ring-1 ring-inset ring-neon-cyan/20 transition-opacity duration-300 group-hover:opacity-100"
      />
      {featured ? (
        <span className="glow-pulse-pink absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neon-pink">
          <Flame aria-hidden className="size-3" />
          Featured
        </span>
      ) : null}
      <div className="relative flex items-center justify-between gap-4 pr-16">
        <Badge variant="cyan">{category}</Badge>
        <span className="inline-flex items-center gap-2 text-xs font-medium text-text-muted">
          <Clock aria-hidden className="size-4" />
          {readTime}
        </span>
      </div>

      <h2 className="font-display relative mt-6 text-2xl font-black tracking-tight text-white">
        {title}
      </h2>
      <p className="relative mt-4 text-sm leading-7 text-text-secondary">{excerpt}</p>

      <Link
        to={`${ROUTES.guides}/${slug}`}
        className="relative mt-6 inline-flex items-center gap-2 rounded-full text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Read guide
        <ArrowUpRight
          aria-hidden
          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </Card>
  );
}
