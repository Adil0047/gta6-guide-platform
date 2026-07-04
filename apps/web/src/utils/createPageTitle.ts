import { SITE_CONFIG } from '@/constants/site';

export function createPageTitle(title: string) {
  return `${title} | ${SITE_CONFIG.name}`;
}
