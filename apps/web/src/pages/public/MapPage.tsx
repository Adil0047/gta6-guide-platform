import { SEO } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { MapExperience } from '@/features/map';

export function MapPage() {
  return (
    <>
      <SEO
        title="Interactive GTA VI Map"
        description="Explore a frontend-ready GTA VI map interface with district markers, marker cards, filters, and future saved locations."
      />
      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neon-pink">
              Interactive map
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Explore the GTA VI map system.
            </h1>
            <p className="mt-6 text-base leading-8 text-text-secondary sm:text-lg">
              A production-ready frontend map experience prepared for real markers, filters, saved
              locations, guide linking, and premium layers.
            </p>
          </div>

          <div className="mt-10">
            <MapExperience />
          </div>
        </Container>
      </main>
    </>
  );
}
