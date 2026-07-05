import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';

const webRoot = resolve(import.meta.dirname, '..');
const publicDir = resolve(webRoot, 'public');
const envFile = resolve(webRoot, '.env');

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
const routes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/guides', changefreq: 'daily', priority: '0.9' },
  { path: '/categories', changefreq: 'weekly', priority: '0.8' },
  { path: '/search', changefreq: 'weekly', priority: '0.6' },
  { path: '/map', changefreq: 'weekly', priority: '0.7' },
];

mkdirSync(publicDir, { recursive: true });
writeFileSync(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
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
