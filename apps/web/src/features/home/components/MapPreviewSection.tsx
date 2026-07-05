import { ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router';

import { Container } from '@/components/ui/Container';
import { ROUTES } from '@/constants/routes';
import { mapLocations } from '@/data';

export function MapPreviewSection() {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">
              Interactive map architecture
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              A map experience built for markers, filters, and saved locations.
            </h2>
            <p className="mt-5 text-sm leading-7 text-text-secondary">
              The map interface is ready for future location layers, district filters, guide-linked
              markers, saved routes, and premium interactive discovery tools.
            </p>

            {/* <Link
              to={ROUTES.map}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Open map
              <ArrowRight aria-hidden className="ml-2 size-4" />
            </Link> */}

            <Link
              to={ROUTES.map}
              className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="text-black">Open map</span>
              <ArrowRight aria-hidden className="ml-2 size-4 text-black" />
            </Link>
            
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-shell border border-white/10 bg-white/[0.035] shadow-panel">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,60,172,0.2),transparent_32%),radial-gradient(circle_at_75%_65%,rgba(0,229,255,0.18),transparent_34%)]" />

            {mapLocations.map((location) => (
              <div
                key={location.id}
                className="absolute"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
              >
                <div className="relative">
                  <span className="absolute -inset-3 animate-ping rounded-full bg-neon-cyan/20" />
                  <span className="relative grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-background/80 text-neon-cyan shadow-[0_0_28px_rgba(0,229,255,0.28)] backdrop-blur-xl">
                    <MapPin aria-hidden className="size-5" />
                  </span>
                </div>
              </div>
            ))}

            <div className="absolute bottom-4 left-4 right-4 rounded-card border border-white/10 bg-background/75 p-4 backdrop-blur-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neon-cyan">
                Live marker layer
              </p>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                {mapLocations.length} structured markers prepared for guide-linked map data.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
