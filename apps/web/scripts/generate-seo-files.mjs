import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webRoot = resolve(scriptDir, '..');
const publicDir = resolve(webRoot, 'public');
const envFile = resolve(webRoot, '.env');
const seoRoutesPath = resolve(webRoot, 'seo-routes.config.json');

function readEnvFile() {
  try {
    return Object.fromEntries(
      readFileSync(envFile, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const [key, ...rest] = line.split('=');
          return [key, rest.join('=').replace(/^"|"$/g, '')];
        }),
    );
  } catch {
    return {};
  }
}

const fileEnv = readEnvFile();
const siteUrl = (process.env.VITE_SITE_URL ?? fileEnv.VITE_SITE_URL ?? 'http://localhost:5173').replace(/\/$/, '');

if (!process.env.VITE_SITE_URL && !fileEnv.VITE_SITE_URL) {
  process.stderr.write(
    '[generate-seo-files] VITE_SITE_URL is not set — robots.txt and sitemap.xml will use http://localhost:5173. Set VITE_SITE_URL in your Vercel project env (or apps/web/.env) before building for production.\n',
  );
}

// Single source of truth: apps/web/seo-routes.config.json (shared with the
// AdminSeoPanel client component to prevent config drift).
const seoConfig = JSON.parse(readFileSync(seoRoutesPath, 'utf8'));
const routes = seoConfig.indexableRoutes;
const disallowedPaths = seoConfig.disallowedPaths;

mkdirSync(publicDir, { recursive: true });

writeFileSync(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *\n${disallowedPaths.map((path) => `Disallow: ${path}`).join('\n')}\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
);

writeFileSync(
  resolve(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes
    .map(
      (route) =>
        `  <url>\n    <loc>${siteUrl}${route.path}</loc>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`,
    )
    .join('\n')}\n</urlset>\n`,
);
