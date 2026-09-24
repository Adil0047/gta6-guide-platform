import { env } from '@/app/config/env';

export const SITE_CONFIG = {
  name: env.appName,
  description:
    'A premium GTA VI guide platform for missions, characters, vehicles, locations, secrets, tips, and interactive map discovery.',
  shortDescription:
    'Premium unofficial GTA VI guides, map locations, and walkthroughs.',
  url: env.siteUrl,
  defaultImage: `${env.siteUrl}/og-image.jpg`,
  defaultImageWidth: '1344',
  defaultImageHeight: '768',
  defaultImageAlt: 'GTA VI Guide Platform — premium unofficial fan guide banner.',
  creator: 'GTA VI Guide Platform',
  locale: 'en_US',
  twitterSite: '@gta6guide',
  twitterCreator: '@gta6guide',
  keywords: [
    'GTA VI guide',
    'GTA 6 guide',
    'GTA VI map',
    'GTA VI missions',
    'GTA VI vehicles',
    'GTA VI characters',
    'GTA VI secrets',
  ],
  social: {
    github: 'https://github.com',
    email: 'team@gta6guide.local',
  },
  disclaimer:
    'Unofficial fan site. Not affiliated with Rockstar Games or Take-Two Interactive.',
} as const;
