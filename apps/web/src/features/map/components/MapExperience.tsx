import { CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

import { mapLocations, type MapLocation } from '@/data';
import { cn } from '@/utils/cn';

import { MapCanvas } from './MapCanvas';
import { MapMarkerCard } from './MapMarkerCard';

export function MapExperience() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(mapLocations[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <MapCanvas selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />

      <aside className="space-y-4">
        <MapMarkerCard location={selectedLocation} />

        <div className="space-y-2">
          <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
            All locations ({mapLocations.length})
          </p>
          {mapLocations.map((location) => {
            const isActive = selectedLocation.id === location.id;
            return (
              <button
                key={location.id}
                type="button"
                aria-pressed={isActive}
                className={cn(
                  'flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  isActive
                    ? 'border-neon-cyan/40 bg-neon-cyan/[0.08] text-white'
                    : 'border-white/10 bg-white/[0.04] text-text-secondary hover:border-neon-cyan/30 hover:bg-white/[0.08] hover:text-white',
                )}
                onClick={() => {
                  setSelectedLocation(location);
                }}
              >
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-white">{location.name}</span>
                  <span className="mt-0.5 block text-xs text-text-muted">
                    {location.district} · {location.type}
                  </span>
                </span>
                {isActive ? (
                  <CheckCircle2 aria-hidden className="size-4 shrink-0 text-neon-cyan" />
                ) : null}
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
