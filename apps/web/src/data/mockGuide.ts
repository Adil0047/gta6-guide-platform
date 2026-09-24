// Dev/preview guide fixture for runtime QA of guide-detail features
// (ReadingProgress, ShareButton, PrintButton, scroll-spy TOC, Article
// schema, FAQPage schema) WITHOUT a backend. Used only by the
// /guides/preview-mock route (noindex) — not wired into the real
// contentService, so production data flow is untouched.
import { type Guide } from '@/types/content';

export const mockGuide: Guide = {
  id: 'mock-guide-001',
  title: 'Conquer the Oceanfront Strip: A Complete Vice City Starter Walkthrough',
  slug: 'preview-mock',
  excerpt:
    'A premium unofficial GTA VI fan guide covering the Oceanfront Strip starter chain — mission routing, vehicle spawns, money farming, and the secret canal shortcut. Everything you need to start strong in Vice City.',
  categorySlug: 'missions',
  categoryLabel: 'Missions',
  type: 'Mission',
  difficulty: 'Beginner',
  readTime: '8 min read',
  publishedAt: '2026-01-15T09:00:00.000Z',
  updatedAt: '2026-02-03T14:30:00.000Z',
  author: {
    name: 'Guide Editorial Desk',
    role: 'Editorial',
  },
  coverGradient: 'from-neon-pink/30 via-neon-purple/20 to-neon-cyan/20',
  tags: ['missions', 'beginner', 'vice-city', 'oceanfront', 'starter', 'route'],
  featured: true,
  views: 4821,
  helpfulVotes: 312,
  sections: [
    {
      id: 'guide-overview',
      title: 'Mission overview',
      body: [
        'The Oceanfront Strip is your first major hub in Vice City. This walkthrough covers the opening mission chain, the fastest routing between objectives, and the vehicle spawns that make early-game traversal efficient.',
        'Treat this as a flexible blueprint rather than a rigid script — GTA VI rewards experimentation, and the routes here optimize for speed without locking you out of optional content.',
      ],
    },
    {
      id: 'starting-route',
      title: 'Starting route & first objective',
      body: [
        'Begin at the Oceanfront Strip marker. The first objective is a short drive north to the Downtown Exchange — take the coastal road rather than the highway to avoid the opening traffic scripting.',
        'On arrival, the mission trigger is on the second floor of the Exchange building. Use the side entrance to skip the lobby cutscene trigger and save ~45 seconds.',
      ],
    },
    {
      id: 'vehicle-spawns',
      title: 'Early vehicle spawns worth grabbing',
      body: [
        'Before the second objective, swing by the Port Access Yard (marker on your map). A reliable muscle car spawns here in the early hours and handles the downtown chase sequence cleanly.',
        'Avoid the Beachcomber — it looks faster on paper but the handling model punishes the tight canal turns later in the chain.',
      ],
    },
    {
      id: 'money-farming',
      title: 'A low-risk money loop',
      body: [
        'After the third objective, a short money loop opens at the Oceanfront shops. Run it twice before the story pushes you onward — it funds the weapon upgrade that trivializes the next combat encounter.',
        'The loop resets on in-game day 2, so do not over-invest. Cap it at two passes.',
      ],
    },
    {
      id: 'secret-shortcut',
      title: 'The Hidden Canal Path shortcut',
      body: [
        'The canal path between Little Havana and the Strip is gated during the day but opens after the third mission. Cutting through here saves a full minute on the final approach to the mission-four trigger.',
        'Watch for the patrol car — if it spots you, the shortcut closes for the rest of the in-game day.',
      ],
    },
    {
      id: 'editorial-summary',
      title: 'Editorial summary',
      body: [
        'Prioritize route efficiency over completionism in the opening chain.',
        'Grab the Port Access muscle car before objective two.',
        'Run the money loop twice, then move on.',
        'Use the canal shortcut after mission three for the fastest final approach.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Do I need to complete the Oceanfront chain before exploring Vice City freely?',
      answer:
        'No — Vice City opens up after the first mission, but completing the Oceanfront chain unlocks the canal shortcut and the money loop, both of which make early exploration much smoother.',
    },
    {
      question: 'Is the muscle car spawn guaranteed?',
      answer:
        'It is guaranteed in the early in-game hours (6:00–10:00). Outside that window it has a ~70% spawn rate. Reload the area if it does not appear.',
    },
    {
      question: 'Does this walkthrough apply to both protagonists?',
      answer:
        'The routing applies to both. The combat encounter difficulty scales slightly differently — adjust your weapon loadout accordingly.',
    },
  ],
  relatedSlugs: [],
  seo: {
    metaTitle: 'GTA VI Oceanfront Strip Starter Walkthrough',
    metaDescription:
      'Complete unofficial GTA VI starter walkthrough for the Oceanfront Strip — mission routing, vehicle spawns, money loop, and the secret canal shortcut.',
    keywords: ['GTA VI walkthrough', 'Oceanfront Strip', 'Vice City starter', 'canal shortcut'],
  },
};
