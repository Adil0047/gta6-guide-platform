import { PrintButton, ReadingProgress, SEO, ShareButton } from '@/components/common';
import { Container } from '@/components/ui/Container';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { Badge } from '@/components/ui/Badge';
import { mockGuide } from '@/data';
import { GuideArticle, GuideDetailHero } from '@/features/guides';
import { ROUTES } from '@/constants/routes';
import { SITE_CONFIG } from '@/constants/site';
import { type Guide } from '@/types/content';
import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Dev/preview page: renders the full guide-detail experience (ReadingProgress,
// ShareButton, PrintButton, scroll-spy TOC, Article + FAQPage + BreadcrumbList
// schema) against a local mock guide fixture — WITHOUT requiring a backend.
// This exists so the round 2–3 guide-detail features can be runtime-QA'd.
// noindex so it never appears in search results.
export function GuidePreviewMockPage() {
  const guide: Guide = mockGuide;
  const canonicalPath = `${ROUTES.guides}/${guide.slug}`;
  const location = useLocation();

  // Deep-link support: scroll to the #section-id hash after render.
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (!hash) {
      return;
    }
    const id = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [location.hash]);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: guide.title,
      description: guide.excerpt,
      articleSection: guide.categoryLabel,
      keywords: guide.tags.join(', '),
      datePublished: guide.publishedAt,
      dateModified: guide.updatedAt,
      inLanguage: 'en-US',
      author: { '@type': 'Person', name: guide.author.name },
      publisher: { '@type': 'Organization', name: SITE_CONFIG.creator, url: SITE_CONFIG.url },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_CONFIG.url}${canonicalPath}`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: guide.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    },
  ];

  return (
    <>
      <ReadingProgress />
      <SEO
        title="GTA VI Guide Preview"
        description="A preview rendering of the guide-detail experience for QA. Not indexed."
        canonicalUrl={canonicalPath}
        type="article"
        noIndex
        structuredData={structuredData}
      />
      <VisuallyHidden as="h1">Guide preview (mock data)</VisuallyHidden>
      <main id="main-content">
        <GuideDetailHero
          guide={guide}
          actions={
            <>
              <ShareButton
                title={guide.title}
                text={guide.excerpt}
                url={`${SITE_CONFIG.url}${canonicalPath}`}
              />
              <PrintButton />
            </>
          }
        />
        <GuideArticle guide={guide} allGuides={[]} />
        <Container className="py-10">
          <div className="rounded-panel border border-warning/20 bg-warning/[0.06] px-5 py-4 text-sm text-text-secondary">
            <Badge variant="pink">Preview</Badge>
            <span className="ml-3">
              This page renders a local mock guide so the guide-detail UX (reading progress, share,
              print, scroll-spy TOC, structured data) can be reviewed without a backend. It is
              <code className="mx-1 rounded bg-white/[0.06] px-1.5 py-0.5 text-xs">noindex</code>
              and never appears in search results.
            </span>
          </div>
        </Container>
      </main>
    </>
  );
}
