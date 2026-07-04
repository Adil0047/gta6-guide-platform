import { type NavigationIcon } from '@/types/navigation';

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  description: string;
  icon: NavigationIcon;
};

export type UserBookmark = {
  id: string;
  guideTitle: string;
  guideSlug: string;
  category: string;
  savedAt: string;
};

export type UserComment = {
  id: string;
  guideTitle: string;
  guideSlug: string;
  body: string;
  status: 'Published' | 'Pending Review';
  createdAt: string;
};

export type AdminRecord = {
  id: string;
  title: string;
  status: string;
  meta: string;
  updatedAt: string;
};
