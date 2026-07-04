import { type Guide } from '@/types/content';

export type GuideSearchFilters = {
  query?: string;
  category?: string;
  difficulty?: string;
  type?: string;
};

export function searchGuides(guides: Guide[], filters: GuideSearchFilters) {
  const query = filters.query?.trim().toLowerCase() ?? '';
  const category = filters.category?.trim().toLowerCase() ?? '';
  const difficulty = filters.difficulty?.trim().toLowerCase() ?? '';
  const type = filters.type?.trim().toLowerCase() ?? '';

  return guides.filter((guide) => {
    const searchableContent = [
      guide.title,
      guide.excerpt,
      guide.categoryLabel,
      guide.type,
      guide.difficulty,
      ...guide.tags,
    ]
      .join(' ')
      .toLowerCase();

    const matchesQuery = query ? searchableContent.includes(query) : true;
    const matchesCategory = category ? guide.categorySlug.toLowerCase() === category : true;
    const matchesDifficulty = difficulty ? guide.difficulty.toLowerCase() === difficulty : true;
    const matchesType = type ? guide.type.toLowerCase() === type : true;

    return matchesQuery && matchesCategory && matchesDifficulty && matchesType;
  });
}

export function getFeaturedGuides(guides: Guide[]) {
  return guides.filter((guide) => guide.featured);
}

export function getGuideBySlug(guides: Guide[], slug: string | undefined) {
  if (!slug) {
    return undefined;
  }

  return guides.find((guide) => guide.slug === slug);
}

export function getRelatedGuides(guides: Guide[], relatedSlugs: string[]) {
  return relatedSlugs
    .map((slug) => guides.find((guide) => guide.slug === slug))
    .filter((guide): guide is Guide => Boolean(guide));
}

export function getGuidesByCategory(guides: Guide[], categorySlug: string | undefined) {
  if (!categorySlug) {
    return [];
  }

  return guides.filter((guide) => guide.categorySlug === categorySlug);
}
