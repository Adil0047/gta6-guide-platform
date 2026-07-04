import { MapPin } from 'lucide-react';
import { useState } from 'react';

import { mapLocations, type MapLocation } from '@/data';
import { cn } from '@/utils/cn';

type MapCanvasProps = {
  selectedLocation: MapLocation;
  onSelectLocation: (location: MapLocation) => void;
};

export function MapCanvas({ selectedLocation, onSelectLocation }: MapCanvasProps) {
  const [focusedLocationId, setFocusedLocationId] = useState(selectedLocation.id);

  return (
    <div className="relative aspect-[4/3] min-h-[28rem] overflow-hidden rounded-shell border border-white/10 bg-white/[0.035] shadow-panel">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:42px_42px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,60,172,0.22),transparent_32%),radial-gradient(circle_at_75%_65%,rgba(0,229,255,0.18),transparent_34%)]" />
      <div className="absolute inset-x-10 top-1/2 h-24 -translate-y-1/2 rotate-[-12deg] rounded-full border border-neon-cyan/20 bg-neon-cyan/5 blur-[1px]" />
      <div className="absolute bottom-10 left-1/2 h-40 w-[70%] -translate-x-1/2 rounded-full border border-neon-pink/20 bg-neon-pink/5 blur-[1px]" />

      {mapLocations.map((location) => {
        const isSelected = selectedLocation.id === location.id;
        const isFocused = focusedLocationId === location.id;

        return (
          <button
            key={location.id}
            type="button"
            className="absolute"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
            aria-label={`Select ${location.name}`}
            onClick={() => {
              onSelectLocation(location);
            }}
            onFocus={() => {
              setFocusedLocationId(location.id);
            }}
          >
            <span
              className={cn(
                'relative grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border backdrop-blur-xl transition',
                isSelected
                  ? 'border-neon-pink bg-neon-pink/20 text-white shadow-[0_0_32px_rgba(255,60,172,0.42)]'
                  : 'border-white/20 bg-background/80 text-neon-cyan shadow-[0_0_28px_rgba(0,229,255,0.24)] hover:border-neon-cyan',
              )}
            >
              {(isSelected || isFocused) && (
                <span className="absolute -inset-3 animate-ping rounded-full bg-neon-cyan/20" />
              )}
              <MapPin aria-hidden className="relative size-5" />
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 right-4 rounded-card border border-white/10 bg-background/80 p-4 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neon-cyan">
          Selected marker
        </p>
        <p className="mt-2 text-sm font-bold text-white">{selectedLocation.name}</p>
        <p className="mt-1 text-xs text-text-muted">{selectedLocation.district}</p>
      </div>
    </div>
  );
}
