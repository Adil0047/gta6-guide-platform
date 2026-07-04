import { MapPin } from 'lucide-react';

import { type MapLocation } from '@/data';

type MapMarkerCardProps = {
  location: MapLocation;
};

export function MapMarkerCard({ location }: MapMarkerCardProps) {
  return (
    <article className="rounded-card border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-neon-cyan">
          <MapPin aria-hidden className="size-5" />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-white">{location.name}</h2>
            <span className="rounded-full border border-neon-pink/20 bg-neon-pink/10 px-3 py-1 text-xs font-semibold text-neon-pink">
              {location.type}
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            {location.district}
          </p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{location.description}</p>
        </div>
      </div>
    </article>
  );
}
