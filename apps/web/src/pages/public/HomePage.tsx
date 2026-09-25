import { SEO } from '@/components/common';
import { faqs } from '@/data';
import { SITE_CONFIG } from '@/constants/site';
import { usePageBackground } from '@/hooks';
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
  usePageBackground('home');
  return (
    <>
      <SEO
        title="GTA VI Guides, Map & Walkthroughs"
        description="A premium GTA VI guide platform for missions, map locations, vehicles, secrets, search, dashboards, and future interactive tools."
        canonicalUrl="/"
        structuredData={[
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: SITE_CONFIG.creator,
            url: SITE_CONFIG.url,
            description: SITE_CONFIG.description,
            email: SITE_CONFIG.social.email,
          },
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: SITE_CONFIG.name,
            alternateName: 'GTA 6 Guide',
            url: SITE_CONFIG.url,
            description: SITE_CONFIG.description,
            inLanguage: 'en-US',
            publisher: {
              '@type': 'Organization',
              name: SITE_CONFIG.creator,
              url: SITE_CONFIG.url,
            },
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_CONFIG.url}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]}
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
