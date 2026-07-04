import { type FaqItem } from '@/types/content';

export const faqs: FaqItem[] = [
  {
    id: 'faq-001',
    question: 'Is this platform only a blog?',
    answer:
      'No. The frontend is designed as a product platform with guide management, search, bookmarks, comments, map tools, AI features, dashboards, and premium expansion in mind.',
  },
  {
    id: 'faq-002',
    question: 'Will the guide content connect to a backend later?',
    answer:
      'Yes. Guide, category, search, profile, and admin surfaces now use the Express and MongoDB backend contracts without changing the user interface architecture.',
  },
  {
    id: 'faq-003',
    question: 'Can this support an interactive GTA VI map?',
    answer:
      'Yes. The map page and data structure are prepared for markers, categories, saved locations, filters, and future premium map layers.',
  },
  {
    id: 'faq-004',
    question: 'Is the site responsive?',
    answer:
      'Yes. The interface is mobile-first, with responsive navigation, flexible cards, scalable typography, accessible focus states, and reduced-motion support.',
  },
];
