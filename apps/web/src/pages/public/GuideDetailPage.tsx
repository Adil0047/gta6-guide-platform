import { useQuery } from '@tanstack/react-query';
import { Navigate, useParams } from 'react-router';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { ROUTES } from '@/constants/routes';
import { GuideArticle, GuideDetailHero } from '@/features/guides';
import { contentService, queryKeys } from '@/services';

export function GuideDetailPage() {
  const { slug } = useParams();
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

  return (
    <>
      <SEO title={guide.title} description={guide.excerpt} />
      <main id="main-content">
        <GuideDetailHero guide={guide} />
        <GuideArticle guide={guide} allGuides={relatedGuides} />
      </main>
    </>
  );
}
