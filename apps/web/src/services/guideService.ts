import { type GuideSummaryDto } from '@gta6-guide/shared/dto';

import { contentService } from '@/services/contentService';

export type GuideSummary = GuideSummaryDto;

export const guideService = {
  async getGuides() {
    const result = await contentService.listGuides();

    return result.items.map((guide) => ({
      id: guide.id,
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
    }));
  },
};
