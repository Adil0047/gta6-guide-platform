import { type z } from 'zod';

import {
  type CategoryAccent,
  type GuideDifficulty,
  type GuideStatus,
  type GuideType,
  type GuideVisibility,
} from '../constants/content.js';
import { type UserRole } from '../constants/roles.js';
import { type ThemePreference, type UserStatus } from '../constants/users.js';
import {
  type changePasswordBodySchema,
  type createCategoryBodySchema,
  type createGuideBodySchema,
  type listCategoriesSchema,
  type listGuidesSchema,
  type listUsersSchema,
  type loginBodySchema,
  type registerBodySchema,
  type searchSchema,
  type updateProfileBodySchema,
} from '../schemas/index.js';

export type IsoDateString = string;

export type RegisterRequestDto = z.infer<typeof registerBodySchema>;

export type LoginRequestDto = z.infer<typeof loginBodySchema>;

export type ChangePasswordRequestDto = z.infer<typeof changePasswordBodySchema>;

export type UserPreferencesDto = {
  theme?: ThemePreference;
  notifications?: {
    editorial?: boolean;
    product?: boolean;
    comments?: boolean;
  };
};

export type UserDto = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  bio?: string;
  isEmailVerified?: boolean;
  preferences?: UserPreferencesDto | unknown;
  createdAt?: IsoDateString | Date;
  updatedAt?: IsoDateString | Date;
};

export type AuthSessionDto = {
  user: UserDto;
  accessToken: string;
};

export type RegisterResponseDto = {
  user: UserDto;
};

export type LoginResponseDto = AuthSessionDto;

export type RefreshResponseDto = AuthSessionDto;

export type CreateCategoryDto = z.infer<typeof createCategoryBodySchema>;

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type CategoryDto = {
  id: string;
  title: string;
  slug: string;
  description: string;
  accent: CategoryAccent;
  isActive: boolean;
  order: number;
  guideCount?: number;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  createdAt?: IsoDateString | Date;
  updatedAt?: IsoDateString | Date;
};

export type GuideSectionDto = {
  heading: string;
  body: string[];
};

export type GuideFaqDto = {
  question: string;
  answer: string;
};

export type GuideSeoDto = {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  keywords?: string[];
  ogImage?: string;
};

export type GuideGameMetaDto = {
  missionName?: string;
  characterNames?: string[];
  locationNames?: string[];
  vehicleNames?: string[];
  weaponNames?: string[];
  platform?: string;
  gameVersion?: string;
};

export type GuideMetricsDto = {
  viewCount: number;
  bookmarkCount: number;
  commentCount: number;
  helpfulCount: number;
};

export type CreateGuideDto = z.infer<typeof createGuideBodySchema>;

export type UpdateGuideDto = Partial<CreateGuideDto>;

export type GuideDto = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  sections: GuideSectionDto[];
  faqs: GuideFaqDto[];
  categoryId: string | CategoryDto;
  tags: string[];
  tagIds: string[];
  type: GuideType;
  difficulty: GuideDifficulty;
  status: GuideStatus;
  visibility: GuideVisibility;
  coverImage: string;
  readTime: number;
  authorId: string | UserDto;
  reviewerId?: string | UserDto;
  publishedAt?: IsoDateString | Date;
  lastReviewedAt?: IsoDateString | Date;
  isFeatured: boolean;
  metrics: GuideMetricsDto;
  seo?: GuideSeoDto;
  gameMeta?: GuideGameMetaDto;
  createdAt?: IsoDateString | Date;
  updatedAt?: IsoDateString | Date;
};

export type GuideSummaryDto = Pick<GuideDto, 'id' | 'title' | 'slug' | 'excerpt'>;

export type ListGuidesQueryDto = z.infer<typeof listGuidesSchema>['query'];

export type ListCategoriesQueryDto = z.infer<typeof listCategoriesSchema>['query'];

export type SearchQueryDto = z.infer<typeof searchSchema>['query'];

export type UpdateProfileDto = z.infer<typeof updateProfileBodySchema>;

export type ListUsersQueryDto = z.infer<typeof listUsersSchema>['query'];
