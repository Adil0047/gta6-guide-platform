import { SEO } from '@/components/common';
import {
  CategoryPreviewSection,
  FaqSection,
  FeaturedGuidesSection,
  HeroSection,
  LatestUpdatesSection,
  MapPreviewSection,
  NewsletterSection,
} from '@/features/home';

export function HomePage() {
  return (
    <>
      <SEO
        title="Premium GTA VI Guide Platform"
        description="A premium GTA VI guide platform for missions, map locations, vehicles, secrets, search, dashboards, and future interactive tools."
      />
      <main id="main-content">
        <HeroSection />
        <FeaturedGuidesSection />
        <CategoryPreviewSection />
        <MapPreviewSection />
        <LatestUpdatesSection />
        <FaqSection />
        <NewsletterSection />
      </main>
    </>
  );
}
