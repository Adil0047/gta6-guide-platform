import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { SearchResults } from '@/features/search';

export function SearchPage() {
  return (
    <>
      <SEO
        title="Search GTA VI Guides"
        description="Search GTA VI guides by missions, map locations, vehicles, money, secrets, categories, difficulty, and guide type."
        noIndex
      />
      <main id="main-content" className="content-scrim py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan text-scrim">
              Search
            </p>
            <h1 className="text-scrim mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the exact guide you need.
            </h1>
            <p className="text-scrim mt-6 text-base leading-8 text-text-secondary sm:text-lg">
              Search the live backend guide index across titles, tags, categories, guide types, and
              editorial summaries.
            </p>
          </div>

          <div className="mt-10">
            <SearchResults />
          </div>
        </Container>
      </main>
    </>
  );
}
