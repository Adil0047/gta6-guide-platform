// Edge Function: per-URL raw-HTML meta injection for SEO.
//
// WHY: The app is a Vite SPA. Vercel's SPA fallback serves the SAME static
// index.html for every URL, so non-JS crawlers (most social scrapers —
// Slack/Twitter/LinkedIn/Discord/Telegram) see only the homepage meta for
// every URL. This Edge Function rewrites the <title>, <meta description>,
// <meta robots>, canonical, Open Graph, Twitter, and a baseline JSON-LD
// <script> into the served index.html based on the request path — so every
// public URL ships correct, crawler-visible meta WITHOUT requiring JS.
//
// RUNTIME: Vercel Edge Runtime (global, low cold-start). Configured via
// vercel.json `edge: { runtime: 'edge' }` export.
//
// SCOPE: Only handles public HTML document requests. Static assets
// (/assets/*, /images/*, /robots.txt, /sitemap.xml, /manifest.webmanifest,
// /og-image.jpg, /favicon*) and API requests (/api/*) are served before
// this function by Vercel's static-file + rewrite precedence, so they
// never reach here. Private routes (/admin, /dashboard, /login, …) get a
// noindex robots meta but still serve index.html (the client router then
// auth-gates them).
//
// The client-side <SEO /> component remains the runtime source of truth
// (e.g. for the Article/FAQPage schema on guide detail once data loads);
// this function only provides the static baseline that non-JS clients see.

export const config = {
  runtime: 'edge',
};

// --- Site config (mirrors apps/web/src/constants/site.ts defaults) ----------
// Read at build time from env so the deployed function uses the production
// domain. Falls back to the request origin so previews work without config.
const DEFAULT_SITE_NAME = 'GTA VI Guide Platform';
const DEFAULT_DESCRIPTION =
  'A premium GTA VI guide platform for missions, characters, vehicles, locations, secrets, tips, and interactive map discovery.';
const DEFAULT_OG_IMAGE_PATH = '/og-image.jpg';
const DEFAULT_OG_IMAGE_WIDTH = '1344';
const DEFAULT_OG_IMAGE_HEIGHT = '768';
const DEFAULT_OG_IMAGE_ALT = 'GTA VI Guide Platform — premium unofficial fan guide banner.';
const DEFAULT_LOCALE = 'en_US';
const DEFAULT_TWITTER_SITE = '@gta6guide';

// --- Route meta table -------------------------------------------------------
// Static public routes with editorial meta. Dynamic routes (/guides/:slug,
// /categories/:slug) get a sensible generic baseline here; the client <SEO />
// component enriches them with the real Article/CollectionPage schema once
// the data loads. (A future enhancement can fetch guide/category meta from
// the API here, but that adds latency + DB coupling to every HTML request.)
type RouteMeta = {
  title: string;
  description: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const PRIVATE_PATHS = [
  '/admin',
  '/dashboard',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/search',
];

function isPrivatePath(pathname: string): boolean {
  return PRIVATE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
}

// Private routes share a generic noindex meta, but dashboard sub-routes get
// a more descriptive title so the raw HTML (seen by non-JS crawlers + social
// scrapers) isn't misleading. All remain noindex,nofollow.
function privateMetaForPath(pathname: string): RouteMeta {
  switch (pathname) {
    case '/dashboard':
      return {
        title: 'User Dashboard',
        description: 'Manage your GTA VI guide bookmarks, comments, map saves, and profile activity.',
        noIndex: true,
      };
    case '/dashboard/bookmarks':
      return {
        title: 'Saved Guides',
        description: 'View saved GTA VI guides in your user dashboard.',
        noIndex: true,
      };
    case '/dashboard/comments':
      return {
        title: 'Your Comments',
        description: 'View your GTA VI Guide Platform comments and discussion activity.',
        noIndex: true,
      };
    case '/dashboard/settings':
      return {
        title: 'Profile Settings',
        description: 'Manage GTA VI Guide Platform profile settings.',
        noIndex: true,
      };
    default:
      return {
        title: DEFAULT_SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        noIndex: true,
      };
  }
}

function getRouteMeta(pathname: string, siteUrl: string): RouteMeta {
  // Private routes get a generic noindex meta. The dashboard sub-routes
  // (/dashboard/bookmarks, etc.) are matched via the /dashboard prefix below
  // for a more descriptive title, but remain noindex.
  if (isPrivatePath(pathname)) {
    return privateMetaForPath(pathname);
  }

  // Dev/QA-only preview route: renders a mock guide for runtime QA. noindex
  // so it never appears in search results, even though it lives under
  // /guides/. Must be checked BEFORE the /guides/:slug branch.
  if (pathname === '/guides/preview-mock') {
    return {
      title: 'GTA VI Guide Preview',
      description: 'A preview rendering of the guide-detail experience for QA. Not indexed.',
      noIndex: true,
    };
  }

  switch (pathname) {
    case '/':
      return {
        title: 'GTA VI Guides, Map & Walkthroughs',
        description:
          'A premium GTA VI guide platform for missions, map locations, vehicles, secrets, search, dashboards, and future interactive tools.',
        type: 'website',
        jsonLd: [
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: DEFAULT_SITE_NAME,
            url: siteUrl,
            description: DEFAULT_DESCRIPTION,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: DEFAULT_SITE_NAME,
            alternateName: 'GTA 6 Guide',
            url: siteUrl,
            description: DEFAULT_DESCRIPTION,
            inLanguage: 'en-US',
            publisher: { '@type': 'Organization', name: DEFAULT_SITE_NAME, url: siteUrl },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${siteUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      };
    case '/guides':
      return {
        title: 'GTA VI Guides',
        description:
          'Browse GTA VI guides for missions, vehicles, map locations, money, characters, secrets, and beginner progression.',
      };
    case '/categories':
      return {
        title: 'GTA VI Categories',
        description:
          'Browse GTA VI guides by missions, map locations, vehicles, characters, weapons, money, secrets, and online content.',
      };
    case '/map':
      return {
        title: 'Interactive GTA VI Map',
        description:
          'Explore a frontend-ready GTA VI map interface with district markers, marker cards, filters, and future saved locations.',
      };
    default:
      if (pathname.startsWith('/guides/')) {
        return {
          title: 'GTA VI Guide',
          description:
            'Read the full GTA VI guide with missions, map locations, vehicles, and walkthroughs on the GTA VI Guide Platform.',
          type: 'article',
        };
      }
      if (pathname.startsWith('/categories/')) {
        return {
          title: 'GTA VI Category Guides',
          description:
            'Browse GTA VI guides in this category — missions, vehicles, map locations, money, secrets, and more.',
        };
      }
  }

  // Unknown / 404
  return {
    title: 'Page Not Found',
    description: 'The requested GTA VI Guide Platform page was not found.',
    noIndex: true,
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJson(value: string): string {
  // JSON.stringify already escapes most things; this only neutralises </script>
  // to prevent the JSON-LD block from prematurely closing the script element.
  return value.replace(/</g, '\\u003c');
}

function buildMetaTags(meta: RouteMeta, siteUrl: string, pathname: string): string {
  const fullTitle = `${meta.title} | ${DEFAULT_SITE_NAME}`;
  const canonical = `${siteUrl}${pathname === '/' ? '' : pathname}`;
  const ogImage = `${siteUrl}${DEFAULT_OG_IMAGE_PATH}`;
  const ogType = meta.type ?? 'website';
  const robotsContent = meta.noIndex ? 'noindex,nofollow' : 'index,follow';

  const tags: string[] = [
    `<title>${escapeHtml(fullTitle)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="robots" content="${robotsContent}" />`,
    `<meta property="og:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta property="og:image:width" content="${DEFAULT_OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${DEFAULT_OG_IMAGE_HEIGHT}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(DEFAULT_OG_IMAGE_ALT)}" />`,
    `<meta property="og:locale" content="${DEFAULT_LOCALE}" />`,
    `<meta property="og:site_name" content="${escapeHtml(DEFAULT_SITE_NAME)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${DEFAULT_TWITTER_SITE}" />`,
    `<meta name="twitter:creator" content="${DEFAULT_TWITTER_SITE}" />`,
    `<meta name="twitter:title" content="${escapeHtml(fullTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(DEFAULT_OG_IMAGE_ALT)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  ];

  if (meta.jsonLd) {
    const blocks = Array.isArray(meta.jsonLd) ? meta.jsonLd : [meta.jsonLd];
    for (const block of blocks) {
      tags.push(
        `<script type="application/ld+json" data-seo-edge>${escapeJson(JSON.stringify(block))}</script>`,
      );
    }
  }

  return tags.join('\n    ');
}

// Cached index.html across warm invocations.
let cachedHtml: string | null = null;

async function getIndexHtml(request: Request): Promise<string | null> {
  if (cachedHtml) {
    return cachedHtml;
  }

  // The built index.html is served from the deployment's static output
  // (apps/web/dist). On Vercel, fetch it via the same URL so the Edge
  // Function reads the deployed asset.
  const url = new URL('/', new URL(request.url));
  const response = await fetch(url.toString());

  if (!response.ok) {
    return null;
  }

  cachedHtml = await response.text();
  return cachedHtml;
}

function resolveSiteUrl(request: Request): string {
  const envUrl = process.env.VITE_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }
  // Fall back to the request origin so previews / branch deploys work.
  return new URL(request.url).origin;
}

export default async function handler(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const pathname = requestUrl.pathname;

  const siteUrl = resolveSiteUrl(request);
  const meta = getRouteMeta(pathname, siteUrl);

  const indexHtml = await getIndexHtml(request);

  if (!indexHtml) {
    // Fallback: if the static index.html can't be fetched, return a minimal
    // HTML with just the meta so crawlers still get correct tags.
    const fallbackHtml = `<!doctype html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />${buildMetaTags(
      meta,
      siteUrl,
      pathname,
    )}</head><body><div id="root"></div></body></html>`;
    return new Response(fallbackHtml, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  const metaTags = buildMetaTags(meta, siteUrl, pathname);

  // Replace the static <title>…</title> in the built index.html and inject
  // the per-path meta tags right before </head>. The static index.html
  // already contains homepage-flavored meta; we overwrite the title and
  // inject our per-path block (the client <SEO /> component will upsert
  // these same tags on hydration, so duplicates are resolved at runtime —
  // and for non-JS crawlers, only our injected block is authoritative
  // because it comes after the static tags in document order).
  let html = indexHtml.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(`${meta.title} | ${DEFAULT_SITE_NAME}`)}</title>`);

  // Remove any pre-existing static robots/description/canonical/og/twitter
  // tags that the built index.html ships, to avoid conflicting duplicates
  // for non-JS crawlers. (The client <SEO /> upserts by selector, so this
  // only affects the raw-HTML view.)
  html = html.replace(
    /<meta\s+(?:name|property)=["'](?:robots|description|og:[^"']+|twitter:[^"']+)["'][^>]*>\s*/gi,
    '',
  );
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');

  // Inject the per-path meta block right before </head>.
  html = html.replace('</head>', `    ${metaTags}\n  </head>`);

  return new Response(html, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, must-revalidate',
    },
  });
}
