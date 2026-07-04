import { type ComponentType } from 'react';

export type NavigationIcon = ComponentType<{
  className?: string;
  'aria-hidden'?: boolean;
}>;

export type NavigationItem = {
  label: string;
  href: string;
  icon: NavigationIcon;
};
