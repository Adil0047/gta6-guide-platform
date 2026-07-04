export const USER_ROLE_VALUES = ['user', 'editor', 'admin', 'superAdmin'] as const;

export type UserRole = (typeof USER_ROLE_VALUES)[number];

export const USER_ROLES = {
  USER: 'user',
  EDITOR: 'editor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'superAdmin',
} as const satisfies Record<string, UserRole>;

export const ADMIN_ROLES = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] as const;

export const EDITOR_ROLES = [USER_ROLES.EDITOR, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN] as const;

export const AUTHENTICATED_ROLES = [
  USER_ROLES.USER,
  USER_ROLES.EDITOR,
  USER_ROLES.ADMIN,
  USER_ROLES.SUPER_ADMIN,
] as const;

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role as (typeof ADMIN_ROLES)[number]);
}

export function isEditorRole(role: UserRole): boolean {
  return EDITOR_ROLES.includes(role as (typeof EDITOR_ROLES)[number]);
}
