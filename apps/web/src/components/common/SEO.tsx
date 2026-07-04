import { useEffect } from 'react';

import { SITE_CONFIG } from '@/constants/site';
import { createPageTitle } from '@/utils/createPageTitle';

type SEOProps = {
  title: string;
  description?: string;
};

export function SEO({ title, description = SITE_CONFIG.description }: SEOProps) {
  useEffect(() => {
    document.title = createPageTitle(title);

    const metaDescription = document.querySelector<HTMLMetaElement>('meta[name="description"]');

    if (metaDescription) {
      metaDescription.content = description;
    }
  }, [description, title]);

  return null;
}
