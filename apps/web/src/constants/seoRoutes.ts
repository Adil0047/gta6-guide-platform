// Typed re-export of the shared SEO route config.
//
// This module bridges the build-time Node script (scripts/generate-seo-files.mjs)
// and the client bundle: both read from the same JSON file
// (apps/web/seo-routes.config.json) so the committed robots.txt, sitemap.xml,
// and the AdminSeoPanel can never drift apart.
//
// Vite supports importing JSON natively; `resolveJsonModule` is enabled via
// the base tsconfig. The import path is relative to the project root because
// the JSON lives outside `src/` (it is a project-level config, not app code).

import seoRoutesConfig from '../../seo-routes.config.json';

type IndexableRoute = {
  path: string;
  changefreq: string;
  priority: string;
};

type StructuredDataType = {
  type: string;
  location: string;
};

export type SeoRoutesConfig = {
  siteName: string;
  indexableRoutes: IndexableRoute[];
  disallowedPaths: string[];
  noindexRoutes: string[];
  structuredDataTypes: StructuredDataType[];
};

export const seoRoutes = seoRoutesConfig as SeoRoutesConfig;
