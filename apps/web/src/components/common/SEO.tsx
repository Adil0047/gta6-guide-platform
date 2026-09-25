import { useEffect } from 'react';

import { SITE_CONFIG } from '@/constants/site';
import { createPageTitle } from '@/utils/createPageTitle';

type SEOProps = {
  title: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  keywords?: readonly string[];
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
};

function upsertMeta(selector: string, attributes: Record<string, string>) {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  const element = existing ?? document.createElement('meta');

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  if (!existing) {
    document.head.appendChild(element);
  }
}

function upsertCanonical(url: string) {
  const existing = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const element = existing ?? document.createElement('link');

  element.rel = 'canonical';
  element.href = url;

  if (!existing) {
    document.head.appendChild(element);
  }
}

function upsertStructuredData(data: SEOProps['structuredData']) {
  const scriptId = 'structured-data';
  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!data) {
    existing?.remove();
    return;
  }

  const script: HTMLScriptElement = existing ?? document.createElement('script');
  script.id = scriptId;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);

  if (!existing) {
    document.head.appendChild(script);
  }
}

function getAbsoluteUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, SITE_CONFIG.url).toString();
  } catch {
    return undefined;
  }
}

export function SEO({
  title,
  description = SITE_CONFIG.description,
  canonicalUrl,
  image,
  imageAlt = SITE_CONFIG.defaultImageAlt,
  noIndex = false,
  type = 'website',
  keywords = SITE_CONFIG.keywords,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    const pageTitle = createPageTitle(title);
    const canonical = getAbsoluteUrl(canonicalUrl) ?? window.location.href;
    const socialImage = getAbsoluteUrl(image) ?? SITE_CONFIG.defaultImage;
    const robotsContent = noIndex
      ? 'noindex,nofollow'
      : 'index,follow,max-image-preview:large';

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robotsContent });
    upsertMeta('meta[name="keywords"]', {
      name: 'keywords',
      content: keywords.join(', '),
    });
    upsertMeta('meta[name="author"]', { name: 'author', content: SITE_CONFIG.creator });

    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_CONFIG.name });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: socialImage });
    upsertMeta('meta[property="og:image:width"]', {
      property: 'og:image:width',
      content: SITE_CONFIG.defaultImageWidth,
    });
    upsertMeta('meta[property="og:image:height"]', {
      property: 'og:image:height',
      content: SITE_CONFIG.defaultImageHeight,
    });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: imageAlt });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: SITE_CONFIG.locale });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:site"]', { name: 'twitter:site', content: SITE_CONFIG.twitterSite });
    upsertMeta('meta[name="twitter:creator"]', {
      name: 'twitter:creator',
      content: SITE_CONFIG.twitterCreator,
    });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: socialImage });
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: imageAlt });

    upsertCanonical(canonical);
    upsertStructuredData(
      structuredData ?? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_CONFIG.name,
        alternateName: 'GTA 6 Guide',
        url: SITE_CONFIG.url,
        description: SITE_CONFIG.description,
        inLanguage: 'en-US',
        publisher: {
          '@type': 'Organization',
          name: SITE_CONFIG.creator,
          url: SITE_CONFIG.url,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    );
  }, [canonicalUrl, description, image, imageAlt, keywords, noIndex, structuredData, title, type]);

  return null;
}
