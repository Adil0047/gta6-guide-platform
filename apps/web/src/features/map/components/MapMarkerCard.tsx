import { Building2, Car, Gamepad2, Home, MapPin, Skull } from 'lucide-react';
import { type ReactNode } from 'react';

import { type MapLocation } from '@/data';

type MapMarkerCardProps = {
  location: MapLocation;
};

const TYPE_META: Record<
  MapLocation['type'],
  { icon: typeof MapPin; accent: string; ring: string }
> = {
  Mission: { icon: Gamepad2, accent: 'text-neon-pink', ring: 'border-neon-pink/30 bg-neon-pink/10' },
  Vehicle: { icon: Car, accent: 'text-neon-cyan', ring: 'border-neon-cyan/30 bg-neon-cyan/10' },
  Secret: { icon: Skull, accent: 'text-neon-purple', ring: 'border-neon-purple/30 bg-neon-purple/10' },
  Business: { icon: Building2, accent: 'text-neon-cyan', ring: 'border-neon-cyan/30 bg-neon-cyan/10' },
  Safehouse: { icon: Home, accent: 'text-neon-pink', ring: 'border-neon-pink/30 bg-neon-pink/10' },
};

function TypeBadge({ type }: { type: MapLocation['type'] }) {
  const meta = TYPE_META[type];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.ring} ${meta.accent}`}
    >
      {type}
    </span>
  );
}

export function MapMarkerCard({ location }: MapMarkerCardProps) {
  const meta = TYPE_META[location.type];
  const Icon: ReactNode = <meta.icon aria-hidden className="size-5" />;

  return (
    <article className="relative overflow-hidden rounded-card border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur-xl">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
      <div className="flex items-start gap-4">
        <div
          className={`grid size-11 shrink-0 place-items-center rounded-2xl border ${meta.ring} ${meta.accent}`}
        >
          {Icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black text-white">{location.name}</h2>
            <TypeBadge type={location.type} />
          </div>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            {location.district}
          </p>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{location.description}</p>
          <p className="mt-4 font-mono text-[10px] text-text-muted">
            x: {location.x} · y: {location.y}
          </p>
        </div>
      </div>
    </article>
  );
}
