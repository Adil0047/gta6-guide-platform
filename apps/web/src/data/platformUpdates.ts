import { type LatestUpdate } from '@/types/content';

export const platformUpdates: LatestUpdate[] = [
  {
    id: 'update-001',
    title: 'Guide structure upgraded for long-form walkthroughs',
    description:
      'Guide pages now support sections, FAQ blocks, related guide linking, metadata, tags, and editorial update tracking.',
    date: '2026-07-03',
    category: 'Platform',
  },
  {
    id: 'update-002',
    title: 'Interactive map architecture prepared',
    description:
      'The map experience is structured for future marker layers, location cards, filters, saved places, and guide-linked discovery.',
    date: '2026-07-02',
    category: 'Map',
  },
  {
    id: 'update-003',
    title: 'Search experience connected to backend content',
    description:
      'Search routes now use the backend search API across titles, excerpts, content, tags, guide types, and difficulty levels.',
    date: '2026-07-01',
    category: 'Search',
  },
];
