export type MapLocation = {
  id: string;
  name: string;
  district: string;
  type: 'Mission' | 'Vehicle' | 'Secret' | 'Business' | 'Safehouse';
  x: number;
  y: number;
  description: string;
};

export const mapLocations: MapLocation[] = [
  {
    id: 'map-001',
    name: 'Oceanfront Strip',
    district: 'Vice Beach',
    type: 'Business',
    x: 68,
    y: 34,
    description: 'High-traffic coastal zone prepared for shops, nightlife, missions, and collectible routes.',
  },
  {
    id: 'map-002',
    name: 'Downtown Exchange',
    district: 'Downtown',
    type: 'Mission',
    x: 48,
    y: 48,
    description: 'Central district marker for future mission chains, services, and fast routing.',
  },
  {
    id: 'map-003',
    name: 'Port Access Yard',
    district: 'Industrial Port',
    type: 'Vehicle',
    x: 31,
    y: 69,
    description: 'Utility-heavy zone prepared for vehicle spawns, cargo missions, and escape routes.',
  },
  {
    id: 'map-004',
    name: 'Hidden Canal Path',
    district: 'Little Havana',
    type: 'Secret',
    x: 58,
    y: 72,
    description: 'Exploration marker for future secret paths, collectibles, and hidden encounters.',
  },
  {
    id: 'map-005',
    name: 'North Safehouse Grid',
    district: 'North Vice',
    type: 'Safehouse',
    x: 39,
    y: 22,
    description: 'Residential marker prepared for safehouse planning, storage, and nearby services.',
  },
];
