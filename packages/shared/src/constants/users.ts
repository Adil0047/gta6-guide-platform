export const USER_STATUS_VALUES = ['active', 'suspended', 'deleted'] as const;

export type UserStatus = (typeof USER_STATUS_VALUES)[number];

export const USER_STATUSES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  DELETED: 'deleted',
} as const satisfies Record<string, UserStatus>;

export const THEME_VALUES = ['dark', 'light', 'system'] as const;

export type ThemePreference = (typeof THEME_VALUES)[number];

export const THEME_PREFERENCES = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
} as const satisfies Record<string, ThemePreference>;
