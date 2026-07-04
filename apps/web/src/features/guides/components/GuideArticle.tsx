import { Bookmark, CheckCircle2, MessageCircle } from 'lucide-react';

import { GuideCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { type Guide } from '@/types/content';
import { GuideTableOfContents } from './GuideTableOfContents';

type GuideArticleProps = {
  guide: Guide;
  allGuides: Guide[];
};

export function GuideArticle({ guide, allGuides }: GuideArticleProps) {
  const relatedGuides = allGuides
    .filter((candidate) => candidate.slug !== guide.slug && candidate.categorySlug === guide.categorySlug)
    .slice(0, 4);

  return (
    <section className="pb-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_18rem] lg:px-8">
        <article className="min-w-0">
          <Card className="p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap gap-3">
              {guide.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-12">
              {guide.sections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="text-3xl font-black tracking-tight text-white">{section.title}</h2>
                  <div className="mt-5 space-y-5">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-text-secondary">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 rounded-panel border border-white/10 bg-background/50 p-5">
              <h2 className="text-xl font-black text-white">Editorial summary</h2>
              <ul className="mt-5 space-y-3">
                <li className="flex gap-3 text-sm leading-6 text-text-secondary">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-neon-cyan" />
                  Prioritize route efficiency, mission readiness, and flexible progression.
                </li>
                <li className="flex gap-3 text-sm leading-6 text-text-secondary">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-neon-cyan" />
                  Use category-specific planning instead of treating every activity equally.
                </li>
                <li className="flex gap-3 text-sm leading-6 text-text-secondary">
                  <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-neon-cyan" />
                  Revisit this guide after major content updates to keep your approach current.
                </li>
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button>
                <Bookmark aria-hidden className="mr-2 size-4" />
                Save guide
              </Button>
              <Button variant="ghost">
                <MessageCircle aria-hidden className="mr-2 size-4" />
                Discuss guide
              </Button>
            </div>
          </Card>

          {guide.faqs.length > 0 ? (
            <div className="mt-10">
              <SectionHeader
                eyebrow="Guide FAQ"
                title="Common questions"
                description="Quick answers for players who want the main takeaways without rereading the entire guide."
              />
              <div className="mt-6 space-y-4">
                {guide.faqs.map((faq) => (
                  <Card key={faq.question} className="p-6">
                    <h3 className="text-lg font-black text-white">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-text-secondary">{faq.answer}</p>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {relatedGuides.length > 0 ? (
            <div className="mt-10">
              <SectionHeader
                eyebrow="Related guides"
                title="Continue with these guides"
                description="Recommended next reads based on this guide topic and progression path."
              />
              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {relatedGuides.map((relatedGuide) => (
                  <GuideCard
                    key={relatedGuide.id}
                    title={relatedGuide.title}
                    slug={relatedGuide.slug}
                    excerpt={relatedGuide.excerpt}
                    category={relatedGuide.categoryLabel}
                    readTime={relatedGuide.readTime}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </article>

        <aside className="hidden lg:block">
          <GuideTableOfContents sections={guide.sections} />
        </aside>
      </div>
    </section>
  );
}
