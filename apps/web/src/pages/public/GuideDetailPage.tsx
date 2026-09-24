import { useQuery } from '@tanstack/react-query';
import { Navigate, useLocation, useParams } from 'react-router';
import { useEffect } from 'react';

import { PrintButton, ReadingProgress, SEO, ShareButton } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { SITE_CONFIG } from '@/constants/site';
import { GuideArticle, GuideDetailHero } from '@/features/guides';
import { contentService, getGuideSeo, queryKeys } from '@/services';

export function GuideDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const guideQuery = useQuery({
    queryKey: queryKeys.guide(slug),
    queryFn: () => contentService.getGuideBySlug(slug ?? ''),
    enabled: Boolean(slug),
  });
  const relatedQuery = useQuery({
    queryKey: queryKeys.guides({ limit: 6, categorySlug: guideQuery.data?.categorySlug }),
    queryFn: () =>
      contentService.listGuides({ limit: 6, categorySlug: guideQuery.data?.categorySlug }),
    enabled: Boolean(guideQuery.data?.categorySlug),
  });

  // Deep-link support: when the guide loads after navigating to a URL with a
  // #section-id hash, scroll to that section. The browser's native hash
  // scroll can't fire on load because the section doesn't exist until the
  // guide + sections render (lazy data). This effect runs once the guide is
  // available + the DOM is updated.
  useEffect(() => {
    if (!guideQuery.data) {
      return;
    }
    const hash = location.hash.replace('#', '');
    if (!hash) {
      return;
    }
    // Defer to the next paint so the section elements are in the DOM.
    const id = window.requestAnimationFrame(() => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [guideQuery.data, location.hash]);

  if (!slug) {
    return <Navigate to={ROUTES.guides} replace />;
  }

  if (guideQuery.isLoading) {
    return (
      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading live guide…
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (guideQuery.isError) {
    return (
      <main id="main-content" className="py-14 sm:py-20">
        <Container>
          <ErrorState
            title="Guide not found"
            description="The guide API did not return this slug. Return to the guide library and select another guide."
          />
        </Container>
      </main>
    );
  }

  const guide = guideQuery.data;
  const relatedGuides = relatedQuery.data?.items ?? [];

  if (!guide) {
    return <Navigate to={ROUTES.guides} replace />;
  }

  const canonicalPath = `${ROUTES.guides}/${guide.slug}`;
  const guideSeo = getGuideSeo(guide);
  // BreadcrumbList JSON-LD is emitted by the <Breadcrumbs /> component in
  // GuideDetailHero, so we only emit Article + (conditional) FAQPage here.
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
      author: {
        '@type': 'Person',
        name: guide.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.creator,
        url: SITE_CONFIG.url,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${SITE_CONFIG.url}${canonicalPath}`,
      },
    },
    ...(guide.faqs.length > 0
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: guide.faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          },
        ]
      : []),
  ];

  return (
    <>
      <ReadingProgress />
      <SEO
        title={guideSeo.title}
        description={guideSeo.description}
        canonicalUrl={canonicalPath}
        image={guideSeo.image}
        type="article"
        keywords={guideSeo.keywords}
        structuredData={structuredData}
      />
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
        <GuideArticle guide={guide} allGuides={relatedGuides} />
      </main>
    </>
  );
}
