export const CATEGORY_ACCENT_VALUES = ['pink', 'cyan', 'purple'] as const;

export type CategoryAccent = (typeof CATEGORY_ACCENT_VALUES)[number];

export const GUIDE_TYPE_VALUES = [
  'Mission',
  'Map',
  'Vehicle',
  'Character',
  'Money',
  'Secrets',
  'Online',
  'Beginner',
] as const;

export type GuideType = (typeof GUIDE_TYPE_VALUES)[number];

export const GUIDE_DIFFICULTY_VALUES = ['Beginner', 'Intermediate', 'Advanced'] as const;

export type GuideDifficulty = (typeof GUIDE_DIFFICULTY_VALUES)[number];

export const GUIDE_STATUS_VALUES = ['draft', 'review', 'published', 'archived'] as const;

export type GuideStatus = (typeof GUIDE_STATUS_VALUES)[number];

export const GUIDE_VISIBILITY_VALUES = ['public', 'private', 'premium'] as const;

export type GuideVisibility = (typeof GUIDE_VISIBILITY_VALUES)[number];

export const GUIDE_SORT_VALUES = ['latest', 'oldest', 'popular'] as const;

export type GuideSort = (typeof GUIDE_SORT_VALUES)[number];
