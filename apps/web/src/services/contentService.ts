import {
  BadgeDollarSign,
  Car,
  Crosshair,
  Gamepad2,
  Map,
  MapPin,
  Skull,
  UserRound,
} from 'lucide-react';

import {
  type CategoryDto,
  type GuideDto,
  type GuideGameMetaDto,
  type GuideMetricsDto,
  type GuideSeoDto,
  type GuideSummaryDto,
  type UserDto,
} from '@gta6-guide/shared/dto';
import { type PaginationMeta } from '@gta6-guide/shared/pagination';
import { createSlug } from '@gta6-guide/shared/slug';

import { apiClient } from '@/lib/apiClient';
import { type Category, type Guide } from '@/types/content';
import { type NavigationIcon } from '@/types/navigation';

type MongoDate = string | Date | undefined;

export type MongoCategoryDto = Omit<CategoryDto, 'id' | 'createdAt' | 'updatedAt'> & {
  _id?: string;
  id?: string;
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

type PopulatedCategoryDto = {
  _id?: string;
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  accent?: CategoryDto['accent'];
};

type PopulatedUserDto = {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  avatar?: string;
  role?: UserDto['role'] | string;
};

export type MongoGuideDto = Omit<
  GuideDto,
  'id' | 'categoryId' | 'authorId' | 'reviewerId' | 'publishedAt' | 'lastReviewedAt' | 'createdAt' | 'updatedAt'
> & {
  _id?: string;
  id?: string;
  categoryId: string | PopulatedCategoryDto;
  authorId: string | PopulatedUserDto;
  reviewerId?: string | PopulatedUserDto;
  publishedAt?: MongoDate;
  lastReviewedAt?: MongoDate;
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

export type PaginatedResult<TItem> = {
  items: TItem[];
  meta?: PaginationMeta;
};

export type QueryParams = Record<string, string | number | boolean | undefined>;
export type GuideListParams = QueryParams;
export type CategoryListParams = QueryParams;
export type SearchParams = QueryParams;

function createQueryString(params: Record<string, unknown> = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
}

function getDocumentId(document: { id?: string; _id?: string }) {
  return document.id ?? document._id ?? '';
}

function toIsoDate(value: MongoDate) {
  if (!value) {
    return new Date().toISOString();
  }

  return value instanceof Date ? value.toISOString() : value;
}

function getCategoryIcon(slug: string): NavigationIcon {
  if (slug.includes('mission')) {
    return Gamepad2;
  }

  if (slug.includes('map') || slug.includes('location')) {
    return MapPin;
  }

  if (slug.includes('vehicle')) {
    return Car;
  }

  if (slug.includes('character')) {
    return UserRound;
  }

  if (slug.includes('weapon') || slug.includes('combat')) {
    return Crosshair;
  }

  if (slug.includes('money') || slug.includes('economy')) {
    return BadgeDollarSign;
  }

  if (slug.includes('secret') || slug.includes('mystery')) {
    return Skull;
  }

  return Map;
}

function getCategoryTitle(categoryId: MongoGuideDto['categoryId']) {
  return typeof categoryId === 'object' ? categoryId.title ?? 'Guide' : 'Guide';
}

function getCategorySlug(categoryId: MongoGuideDto['categoryId']) {
  return typeof categoryId === 'object' ? categoryId.slug ?? '' : '';
}

function getAuthor(authorId: MongoGuideDto['authorId']): Guide['author'] {
  if (typeof authorId === 'object') {
    return {
      name: authorId.name ?? authorId.username ?? 'Guide Team',
      role: String(authorId.role ?? 'Editorial Desk'),
    };
  }

  return {
    name: 'Guide Team',
    role: 'Editorial Desk',
  };
}

function getCoverGradient(guide: MongoGuideDto) {
  const categorySlug = getCategorySlug(guide.categoryId);

  if (categorySlug.includes('money')) {
    return 'from-success/25 via-neon-cyan/20 to-neon-purple/20';
  }

  if (categorySlug.includes('vehicle')) {
    return 'from-neon-cyan/25 via-neon-purple/20 to-neon-pink/20';
  }

  if (categorySlug.includes('secret')) {
    return 'from-neon-purple/30 via-neon-pink/20 to-neon-cyan/20';
  }

  return 'from-neon-pink/30 via-neon-purple/20 to-neon-cyan/20';
}

function normalizeMetrics(metrics: GuideMetricsDto | undefined): GuideMetricsDto {
  return {
    viewCount: metrics?.viewCount ?? 0,
    bookmarkCount: metrics?.bookmarkCount ?? 0,
    commentCount: metrics?.commentCount ?? 0,
    helpfulCount: metrics?.helpfulCount ?? 0,
  };
}

function normalizeSections(guide: MongoGuideDto): Guide['sections'] {
  if (guide.sections.length > 0) {
    return guide.sections.map((section) => ({
      id: createSlug(section.heading),
      title: section.heading,
      body: section.body,
    }));
  }

  return [
    {
      id: 'guide-overview',
      title: 'Guide overview',
      body: guide.content
        .split('\n')
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    },
  ];
}

export function normalizeCategory(category: MongoCategoryDto): Category {
  const id = getDocumentId(category);

  return {
    id,
    title: category.title,
    slug: category.slug,
    description: category.description,
    guideCount: category.guideCount ?? 0,
    accent: category.accent,
    icon: getCategoryIcon(category.slug),
  };
}

export function normalizeGuide(guide: MongoGuideDto): Guide {
  const metrics = normalizeMetrics(guide.metrics);

  return {
    id: getDocumentId(guide),
    title: guide.title,
    slug: guide.slug,
    excerpt: guide.excerpt,
    categorySlug: getCategorySlug(guide.categoryId),
    categoryLabel: getCategoryTitle(guide.categoryId),
    type: guide.type,
    difficulty: guide.difficulty,
    readTime: `${guide.readTime} min read`,
    publishedAt: toIsoDate(guide.publishedAt ?? guide.createdAt),
    updatedAt: toIsoDate(guide.updatedAt),
    author: getAuthor(guide.authorId),
    coverGradient: getCoverGradient(guide),
    tags: guide.tags,
    featured: guide.isFeatured,
    views: metrics.viewCount,
    helpfulVotes: metrics.helpfulCount,
    sections: normalizeSections(guide),
    faqs: guide.faqs,
    relatedSlugs: [],
  };
}

export function normalizeGuideSummary(guide: MongoGuideDto): GuideSummaryDto {
  return {
    id: getDocumentId(guide),
    title: guide.title,
    slug: guide.slug,
    excerpt: guide.excerpt,
  };
}

export function getGuideSeo(guide: Guide) {
  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

export const contentService = {
  async listGuides(params: GuideListParams = {}): Promise<PaginatedResult<Guide>> {
    const response = await apiClient.getEnvelope<MongoGuideDto[], PaginationMeta>(
      `/guides${createQueryString(params)}`,
    );

    return {
      items: (response.data ?? []).map(normalizeGuide),
      meta: response.meta,
    };
  },

  async getGuideBySlug(slug: string): Promise<Guide> {
    const guide = await apiClient.get<MongoGuideDto>(`/guides/slug/${slug}`);

    return normalizeGuide(guide);
  },

  async listCategories(params: CategoryListParams = {}): Promise<PaginatedResult<Category>> {
    const response = await apiClient.getEnvelope<MongoCategoryDto[], PaginationMeta>(
      `/categories${createQueryString(params)}`,
    );

    return {
      items: (response.data ?? []).map(normalizeCategory),
      meta: response.meta,
    };
  },

  async getCategoryBySlug(slug: string): Promise<Category> {
    const category = await apiClient.get<MongoCategoryDto>(`/categories/slug/${slug}`);

    return normalizeCategory(category);
  },

  async searchGuides(params: SearchParams = {}): Promise<PaginatedResult<Guide>> {
    const response = await apiClient.getEnvelope<MongoGuideDto[], PaginationMeta>(
      `/search${createQueryString(params)}`,
    );

    return {
      items: (response.data ?? []).map(normalizeGuide),
      meta: response.meta,
    };
  },

  createQueryString,
};

export type { GuideGameMetaDto, GuideMetricsDto, GuideSeoDto };
