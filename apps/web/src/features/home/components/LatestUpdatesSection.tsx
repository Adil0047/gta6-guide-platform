import { CalendarDays } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { platformUpdates } from '@/data';
import { formatDate } from '@/utils/formatDate';

export function LatestUpdatesSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="rounded-shell border border-white/10 bg-white/[0.035] p-6 shadow-panel backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan">
                Latest updates
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Platform changes that improve discovery.
              </h2>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                The frontend is structured like a real product with editorial systems,
                discoverability, content quality, and future backend growth in mind.
              </p>
            </div>

            <div className="space-y-4">
              {platformUpdates.map((update) => (
                <article
                  key={update.id}
                  className="rounded-card border border-white/10 bg-background/40 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs font-semibold text-neon-cyan">
                      {update.category}
                    </span>
                    <span className="inline-flex items-center gap-2 text-xs text-text-muted">
                      <CalendarDays aria-hidden className="size-4" />
                      {formatDate(update.date)}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-black tracking-tight text-white">
                    {update.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-text-secondary">{update.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
