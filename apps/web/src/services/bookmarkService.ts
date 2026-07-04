import { type BookmarkDto } from '@gta6-guide/shared/dto';
import { type PaginationMeta } from '@gta6-guide/shared/pagination';

import { apiClient } from '@/lib/apiClient';
import { getAuthOptions } from '@/services/authHeaders';
import {
  normalizeGuide,
  type MongoGuideDto,
  type PaginatedResult,
} from '@/services/contentService';
import { type Guide } from '@/types/content';

type MongoBookmarkDto = Omit<BookmarkDto, 'id' | 'guideId' | 'createdAt' | 'updatedAt'> & {
  _id?: string;
  id?: string;
  guideId: string | MongoGuideDto;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type BookmarkItem = {
  id: string;
  guide: Guide | null;
  createdAt: string;
};

function createQueryString(params: Record<string, string | number | undefined> = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : '';
}

function toIsoDate(value: string | Date | undefined) {
  if (!value) {
    return new Date().toISOString();
  }

  return value instanceof Date ? value.toISOString() : value;
}

function getDocumentId(document: { id?: string; _id?: string }) {
  return document.id ?? document._id ?? '';
}

function normalizeBookmark(bookmark: MongoBookmarkDto): BookmarkItem {
  return {
    id: getDocumentId(bookmark),
    guide: typeof bookmark.guideId === 'object' ? normalizeGuide(bookmark.guideId) : null,
    createdAt: toIsoDate(bookmark.createdAt),
  };
}

export const bookmarkService = {
  async listBookmarks(params: Record<string, string | number | undefined> = {}): Promise<PaginatedResult<BookmarkItem>> {
    const response = await apiClient.getEnvelope<MongoBookmarkDto[], PaginationMeta>(
      `/bookmarks${createQueryString(params)}`,
      getAuthOptions(),
    );

    return {
      items: (response.data ?? []).map(normalizeBookmark),
      meta: response.meta,
    };
  },

  getBookmarkStatus(guideId: string) {
    return apiClient.get<{ isBookmarked: boolean }>(`/bookmarks/guide/${guideId}`, getAuthOptions());
  },

  createBookmark(guideId: string) {
    return apiClient.post<MongoBookmarkDto>('/bookmarks', { guideId }, getAuthOptions());
  },

  deleteBookmark(guideId: string) {
    return apiClient.delete<MongoBookmarkDto>(`/bookmarks/${guideId}`, getAuthOptions());
  },
};
