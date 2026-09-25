import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { GuideListing } from '@/features/guides';
import { usePageBackground } from '@/hooks';

export function GuidesPage() {
  usePageBackground('guides');
  return (
    <>
      <SEO
        title="GTA VI Guides"
        description="Browse GTA VI guides for missions, vehicles, map locations, money, characters, secrets, and beginner progression."
        canonicalUrl="/guides"
      />
      <main id="main-content" className="content-scrim py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-cyan text-scrim">
              Guide library
            </p>
            <h1 className="text-scrim mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore every GTA VI guide.
            </h1>
            <p className="text-scrim mt-6 text-base leading-8 text-text-secondary sm:text-lg">
              Filter by category, difficulty, and guide type to find the walkthrough or strategy you
              need faster.
            </p>
          </div>

          <div className="mt-10">
            <GuideListing />
          </div>
        </Container>
      </main>
    </>
  );
}
