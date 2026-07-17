import { type CommentStatus } from '@gta6-guide/shared/community';
import { type CommentDto, type UserDto } from '@gta6-guide/shared/dto';
import { type PaginationMeta } from '@gta6-guide/shared/pagination';

import { apiClient } from '@/lib/apiClient';
import { getAuthOptions } from '@/services/authHeaders';
import {
  normalizeGuideSummary,
  type MongoGuideDto,
  type PaginatedResult,
} from '@/services/contentService';

type PopulatedUser = Pick<UserDto, 'id' | 'name' | 'username' | 'avatar' | 'role'> & {
  _id?: string;
};

type MongoCommentDto = Omit<
  CommentDto,
  'id' | 'guideId' | 'userId' | 'parentId' | 'createdAt' | 'updatedAt'
> & {
  _id?: string;
  id?: string;
  guideId: string | MongoGuideDto | null;
  userId: string | PopulatedUser | null;
  parentId?: string | MongoCommentDto;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type CommentItem = {
  id: string;
  body: string;
  status: CommentStatus;
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
  guide: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
  } | null;
  user: {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    role?: string;
  } | null;
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

// function normalizeUser(user: string | PopulatedUser): CommentItem['user'] {
//   if (typeof user === 'string') {
//     return null;
//   }

//   return {
//     id: getDocumentId(user),
//     name: user.name,
//     username: user.username,
//     avatar: user.avatar,
//     role: user.role,
//   };
// }

function normalizeUser(user: string | PopulatedUser | null): CommentItem['user'] {
  if (!user || typeof user === 'string') {
    return null;
  }

  return {
    id: getDocumentId(user),
    name: user.name,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
  };
}

function normalizeComment(comment: MongoCommentDto): CommentItem {
  const guide =
    comment.guideId && typeof comment.guideId === 'object'
      ? normalizeGuideSummary(comment.guideId)
      : null;

  return {
    id: getDocumentId(comment),
    body: comment.body,
    status: comment.status,
    isEdited: comment.isEdited,
    createdAt: toIsoDate(comment.createdAt),
    updatedAt: toIsoDate(comment.updatedAt),
    guide,
    user: normalizeUser(comment.userId),
  };
}

export const commentService = {
  async listGuideComments(
    guideId: string,
    params: Record<string, string | number | undefined> = {},
  ): Promise<PaginatedResult<CommentItem>> {
    const response = await apiClient.getEnvelope<MongoCommentDto[], PaginationMeta>(
      `/comments/guide/${guideId}${createQueryString(params)}`,
    );

    return {
      items: (response.data ?? []).map(normalizeComment),
      meta: response.meta,
    };
  },

  async listMyComments(
    params: Record<string, string | number | undefined> = {},
  ): Promise<PaginatedResult<CommentItem>> {
    const response = await apiClient.getEnvelope<MongoCommentDto[], PaginationMeta>(
      `/comments/me${createQueryString(params)}`,
      getAuthOptions(),
    );

    return {
      items: (response.data ?? []).map(normalizeComment),
      meta: response.meta,
    };
  },

  async listComments(
    params: Record<string, string | number | undefined> = {},
  ): Promise<PaginatedResult<CommentItem>> {
    const response = await apiClient.getEnvelope<MongoCommentDto[], PaginationMeta>(
      `/comments${createQueryString(params)}`,
      getAuthOptions(),
    );

    return {
      items: (response.data ?? []).map(normalizeComment),
      meta: response.meta,
    };
  },

  createComment(input: { guideId: string; body: string }) {
    return apiClient.post<MongoCommentDto>('/comments', input, getAuthOptions());
  },

  updateCommentStatus(id: string, status: CommentStatus) {
    return apiClient.patch<MongoCommentDto>(`/comments/${id}/status`, { status }, getAuthOptions());
  },

  deleteComment(id: string) {
    return apiClient.delete<MongoCommentDto>(`/comments/${id}`, getAuthOptions());
  },
};
