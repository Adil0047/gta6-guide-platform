import { BookOpen, Eye, FolderTree, ShieldCheck, UserRound } from 'lucide-react';

import { type UserRole } from '@gta6-guide/shared/roles';
import { type UserStatus } from '@gta6-guide/shared/users';
import { type PaginationMeta } from '@gta6-guide/shared/pagination';
import { type UserDto } from '@gta6-guide/shared/dto';

import { apiClient } from '@/lib/apiClient';
import { getAuthOptions } from '@/services/authHeaders';
import {
  contentService,
  normalizeGuide,
  type MongoGuideDto,
  type PaginatedResult,
} from '@/services/contentService';
import { type AdminRecord, type DashboardStat } from '@/types/dashboard';
import { type Category, type Guide } from '@/types/content';

type AdminOverviewResponse = {
  stats: {
    guideCount: number;
    publishedGuideCount: number;
    categoryCount: number;
    userCount: number;
  };
  recentAuditLogs: Array<{
    _id?: string;
    id?: string;
    action?: string;
    resourceType?: string;
    createdAt?: string | Date;
    metadata?: unknown;
  }>;
};

type UserListParams = {
  page?: number;
  limit?: number;
  q?: string;
  role?: UserRole;
  status?: UserStatus;
};

function createUserQueryString(params: UserListParams = {}) {
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

export function createAdminStats(stats: AdminOverviewResponse['stats']): DashboardStat[] {
  return [
    {
      id: 'published-guides',
      label: 'Published guides',
      value: String(stats.publishedGuideCount),
      description: `${stats.guideCount} total guide records.`,
      icon: BookOpen,
    },
    {
      id: 'categories',
      label: 'Categories',
      value: String(stats.categoryCount),
      description: 'Live taxonomy records in MongoDB.',
      icon: FolderTree,
    },
    {
      id: 'registered-users',
      label: 'Users',
      value: String(stats.userCount),
      description: 'Active account records available to admins.',
      icon: UserRound,
    },
    {
      id: 'system-health',
      label: 'System health',
      value: 'Live',
      description: 'Admin overview API is responding.',
      icon: ShieldCheck,
    },
  ];
}

export function createAnalyticsStats(stats: AdminOverviewResponse['stats']): DashboardStat[] {
  return [
    {
      id: 'total-guides',
      label: 'Total guides',
      value: String(stats.guideCount),
      description: 'All guide records available to the platform.',
      icon: BookOpen,
    },
    {
      id: 'published-share',
      label: 'Published share',
      value: stats.guideCount > 0 ? `${Math.round((stats.publishedGuideCount / stats.guideCount) * 100)}%` : '0%',
      description: 'Live publishing ratio from backend records.',
      icon: Eye,
    },
    {
      id: 'user-base',
      label: 'User base',
      value: String(stats.userCount),
      description: 'Registered users available for dashboard growth.',
      icon: UserRound,
    },
  ];
}

export function createGuideRecord(guide: Guide): AdminRecord {
  return {
    id: guide.id,
    title: guide.title,
    status: guide.featured ? 'Featured' : 'Published',
    meta: `${guide.categoryLabel} · ${guide.difficulty} · ${guide.readTime}`,
    updatedAt: guide.updatedAt,
  };
}

export function createCategoryRecord(category: Category): AdminRecord {
  return {
    id: category.id,
    title: category.title,
    status: category.accent,
    meta: `${category.slug} · ${category.guideCount} guides`,
    updatedAt: new Date().toISOString(),
  };
}

export function createUserRecord(user: UserDto): AdminRecord {
  return {
    id: user.id,
    title: user.name,
    status: user.status,
    meta: `${user.role} · ${user.email}`,
    updatedAt: String(user.updatedAt ?? user.createdAt ?? new Date().toISOString()),
  };
}

export const adminService = {
  async getOverview() {
    return apiClient.get<AdminOverviewResponse>('/admin/overview', getAuthOptions());
  },

  async listGuides(): Promise<PaginatedResult<Guide>> {
    const response = await apiClient.getEnvelope<MongoGuideDto[], PaginationMeta>(
      `/guides${contentService.createQueryString({ limit: 50, sort: 'latest' })}`,
      getAuthOptions(),
    );

    return {
      items: (response.data ?? []).map(normalizeGuide),
      meta: response.meta,
    };
  },

  async deleteGuide(id: string) {
    return apiClient.delete<unknown>(`/guides/${id}`, getAuthOptions());
  },

  async listCategories(): Promise<PaginatedResult<Category>> {
    return contentService.listCategories({ limit: 50 });
  },

  async deleteCategory(id: string) {
    return apiClient.delete<unknown>(`/categories/${id}`, getAuthOptions());
  },

  async listUsers(params: UserListParams = {}): Promise<PaginatedResult<UserDto>> {
    const response = await apiClient.getEnvelope<UserDto[], PaginationMeta>(
      `/users${createUserQueryString({ limit: 50, ...params })}`,
      getAuthOptions(),
    );

    return {
      items: response.data ?? [],
      meta: response.meta,
    };
  },

  async updateUserStatus(id: string, status: UserStatus) {
    return apiClient.patch<UserDto>(`/users/${id}/status`, { status }, getAuthOptions());
  },
};
