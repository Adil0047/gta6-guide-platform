import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router';

import { SITE_CONFIG } from '@/constants/site';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  /**
   * When true (default), emits a BreadcrumbList JSON-LD script so search
   * engines can render breadcrumb rich results. Pages that already emit a
   * BreadcrumbList at the page level should set this to false to avoid
   * duplication.
   */
  withStructuredData?: boolean;
};

function buildBreadcrumbList(items: BreadcrumbItem[]) {
  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : `${SITE_CONFIG.url}/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1;
      const url = item.href && !isLast ? `${SITE_CONFIG.url}${item.href}` : currentUrl;

      return {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: url,
      };
    }),
  };
}

function upsertBreadcrumbStructuredData(data: Record<string, unknown> | null) {
  const scriptId = 'breadcrumb-structured-data';
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

export function Breadcrumbs({ items, withStructuredData = true }: BreadcrumbsProps) {
  useEffect(() => {
    if (!withStructuredData) {
      upsertBreadcrumbStructuredData(null);
      return;
    }

    upsertBreadcrumbStructuredData(buildBreadcrumbList(items));

    return () => {
      upsertBreadcrumbStructuredData(null);
    };
  }, [items, withStructuredData]);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  className="rounded-full transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-white' : ''}
                >
                  {item.label}
                </span>
              )}

              {!isLast ? <ChevronRight aria-hidden className="size-4 text-text-muted" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
