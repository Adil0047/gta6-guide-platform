import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

import { GuideCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Textarea } from '@/components/ui/Textarea';
import { useAuth } from '@/features/auth/AuthProvider';
import { bookmarkService, commentService, queryKeys } from '@/services';
import { type Guide } from '@/types/content';
import { formatDate } from '@/utils/formatDate';
import { GuideTableOfContents } from './GuideTableOfContents';

type GuideArticleProps = {
  guide: Guide;
  allGuides: Guide[];
};

export function GuideArticle({ guide, allGuides }: GuideArticleProps) {
  const [commentBody, setCommentBody] = useState('');
  const queryClient = useQueryClient();
  const { isAuthenticated, isRestoring } = useAuth();

  const bookmarkStatusQuery = useQuery({
    queryKey: queryKeys.bookmarkStatus(guide.id),
    queryFn: () => bookmarkService.getBookmarkStatus(guide.id),
    enabled: isAuthenticated && !isRestoring,
  });
  const commentsQuery = useQuery({
    queryKey: queryKeys.guideComments(guide.id, { limit: 20 }),
    queryFn: () => commentService.listGuideComments(guide.id, { limit: 20 }),
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: async () => {
      if (bookmarkStatusQuery.data?.isBookmarked) {
        await bookmarkService.deleteBookmark(guide.id);
        return false;
      }

      await bookmarkService.createBookmark(guide.id);
      return true;
    },
    onSuccess: (isBookmarked) => {
      queryClient.setQueryData(queryKeys.bookmarkStatus(guide.id), { isBookmarked });
      void queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  const createCommentMutation = useMutation({
    mutationFn: commentService.createComment,
    onSuccess: () => {
      setCommentBody('');
      void queryClient.invalidateQueries({ queryKey: queryKeys.myComments({ limit: 3 }) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.myComments({ limit: 50 }) });
    },
  });

  const relatedGuides = allGuides
    .filter((candidate) => candidate.slug !== guide.slug && candidate.categorySlug === guide.categorySlug)
    .slice(0, 4);
  const isBookmarked = Boolean(bookmarkStatusQuery.data?.isBookmarked);

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
              <Button
                onClick={() => {
                  if (isAuthenticated) {
                    toggleBookmarkMutation.mutate();
                  }
                }}
                disabled={
                  !isAuthenticated ||
                  isRestoring ||
                  toggleBookmarkMutation.isPending ||
                  bookmarkStatusQuery.isLoading
                }
              >
                <Bookmark aria-hidden className="mr-2 size-4" />
                {isBookmarked ? 'Saved guide' : 'Save guide'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  document.getElementById('guide-comments')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <MessageCircle aria-hidden className="mr-2 size-4" />
                Discuss guide
              </Button>
            </div>
            {!isAuthenticated ? (
              <p className="mt-3 text-sm text-text-muted">Sign in to save this guide or post a comment.</p>
            ) : null}
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

          <div id="guide-comments" className="mt-10 scroll-mt-28">
            <SectionHeader
              eyebrow="Community"
              title="Guide comments"
              description="Approved comments are shown here. New comments are saved to the backend and sent for moderation."
            />
            <Card className="mt-6 p-6">
              {isAuthenticated ? (
                <form
                  className="grid gap-4"
                  onSubmit={(event) => {
                    event.preventDefault();
                    const trimmedComment = commentBody.trim();

                    if (trimmedComment.length === 0) {
                      return;
                    }

                    createCommentMutation.mutate({ guideId: guide.id, body: trimmedComment });
                  }}
                >
                  <Textarea
                    value={commentBody}
                    onChange={(event) => {
                      setCommentBody(event.target.value);
                    }}
                    placeholder="Share a useful note about this guide…"
                    maxLength={1200}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">Comments appear publicly after admin approval.</p>
                    <Button type="submit" disabled={createCommentMutation.isPending || commentBody.trim().length < 2}>
                      <Send aria-hidden className="mr-2 size-4" />
                      Submit comment
                    </Button>
                  </div>
                  {createCommentMutation.isSuccess ? (
                    <p className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">
                      Comment submitted for moderation.
                    </p>
                  ) : null}
                </form>
              ) : (
                <p className="text-sm leading-7 text-text-secondary">Sign in to join the discussion.</p>
              )}
            </Card>

            <div className="mt-6 space-y-4">
              {commentsQuery.isLoading ? <p className="text-sm text-text-secondary">Loading comments…</p> : null}
              {commentsQuery.data?.items.map((comment) => (
                <Card key={comment.id} className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {comment.user?.name ?? comment.user?.username ?? 'Community member'}
                      </p>
                      <p className="mt-1 text-xs text-text-muted">{formatDate(comment.createdAt)}</p>
                    </div>
                    {comment.isEdited ? (
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-text-muted">
                        edited
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-4 text-sm leading-7 text-text-secondary">{comment.body}</p>
                </Card>
              ))}
              {!commentsQuery.isLoading && !commentsQuery.data?.items.length ? (
                <p className="rounded-card border border-white/10 bg-white/[0.04] p-5 text-sm text-text-secondary">
                  No approved comments yet.
                </p>
              ) : null}
            </div>
          </div>

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
