import { env } from '@/app/config/env';

export const SITE_CONFIG = {
  name: env.appName,
  description:
    'A premium GTA VI guide platform for missions, characters, vehicles, locations, secrets, tips, and interactive map discovery.',
  url: env.siteUrl,
  defaultImage: `${env.siteUrl}/og-image.png`,
  creator: 'GTA VI Guide Platform',
  keywords: [
    'GTA VI guide',
    'GTA 6 guide',
    'GTA VI map',
    'GTA VI missions',
    'GTA VI vehicles',
    'GTA VI characters',
    'GTA VI secrets',
  ],
} as const;
