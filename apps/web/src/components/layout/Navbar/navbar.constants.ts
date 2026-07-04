import { Compass, Gamepad2, LayoutGrid, Map, Search } from 'lucide-react';

import { ROUTES } from '@/constants/routes';
import { type NavigationItem } from '@/types/navigation';

export const NAVBAR_LINKS: NavigationItem[] = [
  {
    label: 'Home',
    href: ROUTES.home,
    icon: Compass,
  },
  {
    label: 'Guides',
    href: ROUTES.guides,
    icon: Gamepad2,
  },
  {
    label: 'Categories',
    href: ROUTES.categories,
    icon: LayoutGrid,
  },
  {
    label: 'Map',
    href: ROUTES.map,
    icon: Map,
  },
  {
    label: 'Search',
    href: ROUTES.search,
    icon: Search,
  },
];
