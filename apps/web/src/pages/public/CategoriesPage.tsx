import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { CategoryHeroGrid } from '@/features/categories';

export function CategoriesPage() {
  return (
    <>
      <SEO
        title="GTA VI Categories"
        description="Browse GTA VI guides by missions, map locations, vehicles, characters, weapons, money, secrets, and online content."
      />
      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">
              Categories
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find guides by gameplay system.
            </h1>
            <p className="mt-6 text-base leading-8 text-text-secondary sm:text-lg">
              Every major GTA VI content area is organized into clean, scalable categories for fast
              discovery.
            </p>
          </div>

          <div className="mt-10">
            <CategoryHeroGrid />
          </div>
        </Container>
      </main>
    </>
  );
}
