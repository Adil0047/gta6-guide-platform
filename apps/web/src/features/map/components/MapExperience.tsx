import { useState } from 'react';

import { mapLocations, type MapLocation } from '@/data';

import { MapCanvas } from './MapCanvas';
import { MapMarkerCard } from './MapMarkerCard';

export function MapExperience() {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation>(mapLocations[0]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <MapCanvas selectedLocation={selectedLocation} onSelectLocation={setSelectedLocation} />

      <aside className="space-y-4">
        <MapMarkerCard location={selectedLocation} />

        <div className="space-y-3">
          {mapLocations.map((location) => (
            <button
              key={location.id}
              type="button"
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left text-sm transition hover:border-neon-cyan/40 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={() => {
                setSelectedLocation(location);
              }}
            >
              <span className="block font-bold text-white">{location.name}</span>
              <span className="mt-1 block text-xs text-text-muted">
                {location.district} · {location.type}
              </span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}
