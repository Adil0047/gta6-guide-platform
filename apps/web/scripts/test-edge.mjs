// Edge Function integration test — regression guard for api/seo.ts.
//
// Runs the REAL Edge Function handler against the REAL built dist/index.html
// (produced by `vite build`) with a stubbed global `fetch` + process.env.
// Verifies per-path title, robots, canonical, OG, Twitter, JSON-LD, and that
// the root div + scripts survive. This caught a production-breaking bug in
// round 5 (a `FetchEvent` cast that would have thrown on every request).
//
// Usage: `bun run build && bun run test:edge` (or `bunx tsx scripts/test-edge.mjs`
// after a build). Exits non-zero on any failure.

/* eslint-env node */
/* global console, process, Request, Response */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDir, '..');
const distIndexHtml = resolve(webRoot, 'dist', 'index.html');
const edgeFunctionPath = resolve(webRoot, '..', '..', 'api', 'seo.ts');

if (!existsSync(distIndexHtml)) {
  console.error(
    '[test-edge] dist/index.html not found. Run `bun run build` first (or `vite build`).',
  );
  process.exit(1);
}

const distHtml = readFileSync(distIndexHtml, 'utf8');

// Stub global fetch so the Edge Function's getIndexHtml() reads the real
// built index.html.
globalThis.fetch = async () =>
  new Response(distHtml, {
    status: 200,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });

// Stub process.env so resolveSiteUrl() uses a fixed production URL.
process.env.VITE_SITE_URL = 'https://gta6guide.example.com';

const SITE_URL = 'https://gta6guide.example.com';
const DEFAULT_SITE_NAME = 'GTA VI Guide Platform';

let pass = 0;
let fail = 0;

function check(name, actual, expected) {
  const ok = actual === expected;
  if (ok) {
    pass++;
  } else {
    fail++;
    console.error(`  ✖ ${name}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`);
  }
}

function extract(html, regex, group = 1) {
  const m = html.match(regex);
  return m ? m[group] : null;
}

async function runPath(pathname, expectations) {
  const { default: handler } = await import(edgeFunctionPath);
  const req = new Request(`${SITE_URL}${pathname}`, { method: 'GET' });
  const res = await handler(req);
  const html = await res.text();

  const title = extract(html, /<title>(.*?)<\/title>/);
  const robots = extract(html, /<meta name="robots" content="([^"]+)"/);
  const canonical = extract(html, /<link rel="canonical" href="([^"]+)"/);
  const ogType = extract(html, /<meta property="og:type" content="([^"]+)"/);
  const ogImage = extract(html, /<meta property="og:image" content="([^"]+)"/);
  const ogLocale = extract(html, /<meta property="og:locale" content="([^"]+)"/);
  const twSite = extract(html, /<meta name="twitter:site" content="([^"]+)"/);
  const jsonLdCount = (html.match(/<script type="application\/ld\+json" data-seo-edge>/g) || []).length;
  const descCount = (html.match(/<meta name="description"/g) || []).length;
  const canonicalCount = (html.match(/<link rel="canonical"/g) || []).length;
  const hasRootDiv = html.includes('<div id="root"></div>');
  const hasMainScript = /<script type="module"[^>]*src="\/assets\//.test(html);
  // gtag is intentionally NOT in the raw HTML — it's consent-gated and
  // injected client-side by <GoogleAnalytics /> only after the user accepts
  // optional cookies (GDPR compliance, round 9). The raw HTML served by the
  // Edge Function must therefore NOT reference googletagmanager.
  const hasGtagReference = html.includes('googletagmanager');

  const e = expectations;
  console.log(`PATH: ${pathname}`);
  if (e.title) check('  title', title, e.title);
  if (e.robots) check('  robots', robots, e.robots);
  if (e.canonical !== undefined) check('  canonical', canonical, e.canonical);
  if (e.ogType) check('  og:type', ogType, e.ogType);
  if (e.ogImage) check('  og:image', ogImage, e.ogImage);
  if (e.ogLocale) check('  og:locale', ogLocale, e.ogLocale);
  if (e.twSite) check('  twitter:site', twSite, e.twSite);
  if (e.jsonLdCount !== undefined) check('  jsonLd blocks', jsonLdCount, e.jsonLdCount);
  check('  desc tags (no dupes)', descCount, 1);
  check('  canonical tags (no dupes)', canonicalCount, 1);
  check('  root div intact', hasRootDiv, true);
  check('  main module script intact', hasMainScript, true);
  check('  gtag absent from raw HTML (consent-gated)', hasGtagReference, false);
  console.log('');
}

const N = (name) => `${name} | ${DEFAULT_SITE_NAME}`;

const tests = [
  ['/', {
    title: N('GTA VI Guides, Map &amp; Walkthroughs'),
    robots: 'index,follow,max-image-preview:large',
    canonical: SITE_URL,
    ogType: 'website',
    ogImage: `${SITE_URL}/og-image.jpg`,
    ogLocale: 'en_US',
    twSite: '@gta6guide',
    jsonLdCount: 2,
  }],
  ['/guides', {
    title: N('GTA VI Guides'),
    robots: 'index,follow,max-image-preview:large',
    canonical: `${SITE_URL}/guides`,
    ogType: 'website',
    jsonLdCount: 0,
  }],
  ['/categories', {
    title: N('GTA VI Categories'),
    canonical: `${SITE_URL}/categories`,
  }],
  ['/map', {
    title: N('Interactive GTA VI Map'),
    canonical: `${SITE_URL}/map`,
  }],
  ['/guides/some-slug', {
    title: N('GTA VI Guide'),
    canonical: `${SITE_URL}/guides/some-slug`,
    ogType: 'article',
  }],
  ['/guides/preview-mock', {
    title: N('GTA VI Guide Preview'),
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/guides/preview-mock`,
  }],
  ['/login', {
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/login`,
  }],
  ['/admin', {
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/admin`,
  }],
  ['/dashboard', {
    title: N('User Dashboard'),
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/dashboard`,
  }],
  ['/dashboard/bookmarks', {
    title: N('Saved Guides'),
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/dashboard/bookmarks`,
  }],
  ['/dashboard/comments', {
    title: N('Your Comments'),
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/dashboard/comments`,
  }],
  ['/dashboard/settings', {
    title: N('Profile Settings'),
    robots: 'noindex,nofollow',
    canonical: `${SITE_URL}/dashboard/settings`,
  }],
  ['/this-does-not-exist', {
    title: N('Page Not Found'),
    robots: 'noindex,nofollow',
  }],
];

for (const [pathname, expectations] of tests) {
  await runPath(pathname, expectations);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
