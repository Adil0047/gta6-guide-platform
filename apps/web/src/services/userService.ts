import { type CommentStatus } from '@gta6-guide/shared/community';
import { type UpdateProfileDto, type UserDto } from '@gta6-guide/shared/dto';

import { apiClient } from '@/lib/apiClient';
import { getAuthOptions } from '@/services/authHeaders';
import { normalizeGuide, type MongoGuideDto } from '@/services/contentService';
import { type Guide } from '@/types/content';

type MongoDate = string | Date | undefined;

type PopulatedUser = Pick<UserDto, 'id' | 'name' | 'username' | 'avatar' | 'role'> & {
  _id?: string;
};

type MongoBookmarkDto = {
  _id?: string;
  id?: string;
  guideId: string | MongoGuideDto | null;
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

type MongoRecentlyViewedDto = {
  _id?: string;
  id?: string;
  guideId: string | MongoGuideDto | null;
  viewedAt?: MongoDate;
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

type MongoCommentDto = {
  _id?: string;
  id?: string;
  body: string;
  status: CommentStatus;
  isEdited?: boolean;
  guideId: string | MongoGuideDto | null;
  userId: string | PopulatedUser;
  createdAt?: MongoDate;
  updatedAt?: MongoDate;
};

type MongoUserDashboardDto = {
  user: UserDto;
  stats: UserDashboardStats;
  recentBookmarks: MongoBookmarkDto[];
  recentComments: MongoCommentDto[];
  recentlyViewedGuides: MongoRecentlyViewedDto[];
  recommendations: MongoGuideDto[];
};

export type UserDashboardStats = {
  totalBookmarks: number;
  totalComments: number;
  recentlyViewedCount: number;
  publishedCommentsCount: number;
  profileCompletion?: number;
};

export type DashboardBookmark = {
  id: string;
  guide: Guide | null;
  createdAt: string;
};

export type DashboardComment = {
  id: string;
  body: string;
  status: CommentStatus;
  guide: Guide | null;
  createdAt: string;
};

export type DashboardRecentlyViewed = {
  id: string;
  guide: Guide | null;
  viewedAt: string;
};

export type UserDashboard = {
  user: UserDto;
  stats: UserDashboardStats;
  recentBookmarks: DashboardBookmark[];
  recentComments: DashboardComment[];
  recentlyViewedGuides: DashboardRecentlyViewed[];
  recommendations: Guide[];
};

function getDocumentId(document: { id?: string; _id?: string }) {
  return document.id ?? document._id ?? '';
}

function toIsoDate(value: MongoDate) {
  if (!value) {
    return new Date().toISOString();
  }

  return value instanceof Date ? value.toISOString() : value;
}

function normalizeMaybeGuide(guide: string | MongoGuideDto | null): Guide | null {
  if (!guide || typeof guide === 'string') {
    return null;
  }

  return normalizeGuide(guide);
}

function normalizeBookmark(bookmark: MongoBookmarkDto): DashboardBookmark {
  return {
    id: getDocumentId(bookmark),
    guide: normalizeMaybeGuide(bookmark.guideId),
    createdAt: toIsoDate(bookmark.createdAt),
  };
}

function normalizeComment(comment: MongoCommentDto): DashboardComment {
  return {
    id: getDocumentId(comment),
    body: comment.body,
    status: comment.status,
    guide: normalizeMaybeGuide(comment.guideId),
    createdAt: toIsoDate(comment.createdAt),
  };
}

function normalizeRecentlyViewed(item: MongoRecentlyViewedDto): DashboardRecentlyViewed {
  return {
    id: getDocumentId(item),
    guide: normalizeMaybeGuide(item.guideId),
    viewedAt: toIsoDate(item.viewedAt ?? item.updatedAt ?? item.createdAt),
  };
}

function normalizeDashboard(dashboard: MongoUserDashboardDto): UserDashboard {
  return {
    user: dashboard.user,
    stats: dashboard.stats,
    recentBookmarks: (dashboard.recentBookmarks ?? []).map(normalizeBookmark),
    recentComments: (dashboard.recentComments ?? []).map(normalizeComment),
    recentlyViewedGuides: (dashboard.recentlyViewedGuides ?? []).map(normalizeRecentlyViewed),
    recommendations: (dashboard.recommendations ?? []).map(normalizeGuide),
  };
}

export const userService = {
  getMe() {
    return apiClient.get<UserDto>('/users/me', getAuthOptions());
  },

  async getDashboard() {
    const dashboard = await apiClient.get<MongoUserDashboardDto>('/users/me/dashboard', getAuthOptions());

    return normalizeDashboard(dashboard);
  },

  updateMe(input: UpdateProfileDto) {
    return apiClient.patch<UserDto>('/users/me', input, getAuthOptions());
  },
};
