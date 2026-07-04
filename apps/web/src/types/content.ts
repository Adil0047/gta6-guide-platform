import {
  type CategoryAccent,
  type GuideDifficulty,
  type GuideType,
} from '@gta6-guide/shared/content';

import { type NavigationIcon } from '@/types/navigation';

export type { GuideDifficulty, GuideType };

export type GuideSection = {
  id: string;
  title: string;
  body: string[];
};

export type GuideFaq = {
  question: string;
  answer: string;
};

export type Guide = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categorySlug: string;
  categoryLabel: string;
  type: GuideType;
  difficulty: GuideDifficulty;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  author: {
    name: string;
    role: string;
  };
  coverGradient: string;
  tags: string[];
  featured: boolean;
  views: number;
  helpfulVotes: number;
  sections: GuideSection[];
  faqs: GuideFaq[];
  relatedSlugs: string[];
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  description: string;
  guideCount: number;
  accent: CategoryAccent;
  icon: NavigationIcon;
};

export type LatestUpdate = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};
