import { CheckCircle2, ExternalLink, Info, AlertTriangle } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { seoRoutes } from '@/constants/seoRoutes';
import { SITE_CONFIG } from '@/constants/site';

const {
  indexableRoutes: INDEXABLE_ROUTES,
  disallowedPaths: DISALLOWED_PATHS,
  structuredDataTypes: STRUCTURED_DATA_TYPES,
  noindexRoutes: NOINDEX_ROUTES,
} = seoRoutes;

function StatusRow({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'good' | 'warn' }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <span
        className={
          tone === 'good'
            ? 'text-sm font-semibold text-neon-cyan'
            : tone === 'warn'
              ? 'text-sm font-semibold text-warning'
              : 'text-sm font-semibold text-white'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function AdminSeoPanel() {
  const siteUrl = SITE_CONFIG.url;
  const isLocalhost = siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1');

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">SEO health</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Read-only snapshot of the committed SEO configuration. These values are generated at
            build time from <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs">scripts/generate-seo-files.mjs</code> and the runtime <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-xs">SITE_CONFIG</code> constant.
          </p>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
          <Info aria-hidden className="size-5" />
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-panel border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white">Site &amp; canonical</h3>
          <div className="mt-3 divide-y divide-white/5">
            <StatusRow
              label="Site URL (VITE_SITE_URL)"
              value={isLocalhost ? `${siteUrl} (dev)` : siteUrl}
              tone={isLocalhost ? 'warn' : 'good'}
            />
            <StatusRow label="OG image" value={`${siteUrl}/og-image.jpg`} tone="good" />
            <StatusRow label="Twitter handle" value={SITE_CONFIG.twitterSite} tone="good" />
            <StatusRow label="Locale" value={SITE_CONFIG.locale} />
            <StatusRow label="Manifest" value="/manifest.webmanifest" tone="good" />
          </div>
          {isLocalhost ? (
            <p className="mt-4 flex items-start gap-2 rounded-2xl border border-warning/20 bg-warning/10 px-3 py-2 text-xs text-warning">
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
              VITE_SITE_URL is not set — robots.txt &amp; sitemap.xml will be generated with localhost URLs. Set VITE_SITE_URL in the Vercel project env before deploying.
            </p>
          ) : null}
        </div>

        <div className="rounded-panel border border-white/10 bg-white/[0.03] p-5">
          <h3 className="text-sm font-bold text-white">robots.txt &amp; sitemap.xml</h3>
          <div className="mt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Indexable routes ({INDEXABLE_ROUTES.length})
            </p>
            <ul className="mt-2 space-y-1.5">
              {INDEXABLE_ROUTES.map((route) => (
                <li key={route.path} className="flex items-center justify-between text-sm">
                  <span className="font-mono text-text-secondary">{route.path}</span>
                  <span className="text-xs text-text-muted">
                    {route.changefreq} · priority {route.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
              Disallowed paths ({DISALLOWED_PATHS.length})
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {DISALLOWED_PATHS.map((path) => (
                <Badge key={path} variant="purple">
                  {path}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-panel border border-white/10 bg-white/[0.03] p-5">
        <h3 className="text-sm font-bold text-white">Structured data (JSON-LD)</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {STRUCTURED_DATA_TYPES.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2"
            >
              <span className="flex items-center gap-2 text-sm text-text-secondary">
                <CheckCircle2 aria-hidden className="size-4 text-neon-cyan" />
                <span className="font-semibold text-white">{item.type}</span>
              </span>
              <span className="text-xs text-text-muted">{item.location}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-panel border border-white/10 bg-white/[0.03] p-5">
        <h3 className="text-sm font-bold text-white">noindex coverage</h3>
        <p className="mt-2 text-xs text-text-muted">
          All private, auth, and utility routes emit <code className="rounded bg-white/[0.06] px-1 py-0.5">noindex,nofollow</code> via the &lt;SEO noIndex /&gt; prop.
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {NOINDEX_ROUTES.map((route) => (
            <span
              key={route}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted"
            >
              {route}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={`${siteUrl}/robots.txt`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-text-secondary transition hover:border-neon-cyan/40 hover:text-white"
        >
          View robots.txt
          <ExternalLink aria-hidden className="size-3.5" />
        </a>
        <a
          href={`${siteUrl}/sitemap.xml`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-text-secondary transition hover:border-neon-cyan/40 hover:text-white"
        >
          View sitemap.xml
          <ExternalLink aria-hidden className="size-3.5" />
        </a>
      </div>
    </Card>
  );
}
