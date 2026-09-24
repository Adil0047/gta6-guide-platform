import { CalendarDays, Clock, Eye, ThumbsUp } from 'lucide-react';
import { type ReactNode } from 'react';

import { Breadcrumbs } from '@/components/navigation';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';
import { useRelativeTime } from '@/hooks';
import { type Guide } from '@/types/content';
import { formatDate } from '@/utils/formatDate';

type GuideDetailHeroProps = {
  guide: Guide;
  actions?: ReactNode;
};

export function GuideDetailHero({ guide, actions }: GuideDetailHeroProps) {
  const updatedRelative = useRelativeTime(guide.updatedAt);

  return (
    <section className="relative overflow-hidden py-14 sm:py-18">
      <Container>
        <Breadcrumbs
          items={[
            { label: 'Home', href: ROUTES.home },
            { label: 'Guides', href: ROUTES.guides },
            { label: guide.title },
          ]}
        />

        <div
          className={`relative mt-8 overflow-hidden rounded-shell border border-white/10 bg-gradient-to-br ${guide.coverGradient} p-6 shadow-panel sm:p-8 lg:p-10`}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 0%, rgba(255,60,172,0.12), transparent 40%), radial-gradient(circle at 80% 100%, rgba(0,229,255,0.10), transparent 45%)',
            }}
          />
          <div className="relative max-w-4xl">
            <div className="flex flex-wrap gap-3">
              <Badge variant="pink">{guide.categoryLabel}</Badge>
              <Badge variant="cyan">{guide.difficulty}</Badge>
              <Badge variant="purple">{guide.type}</Badge>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-3 py-1 text-xs font-semibold text-text-muted backdrop-blur-xl">
                <Clock aria-hidden className="size-3.5" />
                {guide.readTime}
              </span>
            </div>

            <h1 className="mt-7 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              {guide.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-text-secondary sm:text-lg">
              {guide.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-2 text-xs font-semibold text-text-secondary backdrop-blur-xl"
                title={`Updated ${formatDate(guide.updatedAt)}`}
              >
                <CalendarDays aria-hidden className="size-4 text-neon-cyan" />
                Updated {updatedRelative}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-2 text-xs font-semibold text-text-secondary backdrop-blur-xl">
                <Eye aria-hidden className="size-4 text-neon-pink" />
                {guide.views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/40 px-4 py-2 text-xs font-semibold text-text-secondary backdrop-blur-xl">
                <ThumbsUp aria-hidden className="size-4 text-neon-cyan" />
                {guide.helpfulVotes.toLocaleString()} helpful
              </span>
              {actions ? <div className="ml-auto flex flex-wrap items-center gap-2">{actions}</div> : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
