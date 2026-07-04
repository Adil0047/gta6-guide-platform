import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router';

import { SectionHeader } from '@/components/common';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { commentService, queryKeys } from '@/services';
import { formatDate } from '@/utils/formatDate';

export function UserCommentList() {
  const commentsQuery = useQuery({
    queryKey: queryKeys.myComments({ limit: 50 }),
    queryFn: () => commentService.listMyComments({ limit: 50 }),
  });
  const comments = commentsQuery.data?.items ?? [];

  return (
    <div>
      <SectionHeader
        eyebrow="Comments"
        title="Your discussions"
        description="Track your guide comments, moderation state, and discussion history from the backend comment API."
      />

      <div className="mt-8">
        {commentsQuery.isLoading ? (
          <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading your comments…
            </div>
          </div>
        ) : null}

        {commentsQuery.isError ? (
          <ErrorState
            title="Could not load comments"
            description="The comment API did not return your discussion history successfully."
          />
        ) : null}

        {!commentsQuery.isLoading && !commentsQuery.isError && comments.length === 0 ? (
          <EmptyState
            icon={<MessageCircle aria-hidden className="size-8" />}
            title="No comments yet"
            description="Post a comment from any guide page and it will appear here with its moderation status."
          />
        ) : null}

        {!commentsQuery.isLoading && !commentsQuery.isError && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {comment.guide ? comment.guide.title : 'Guide unavailable'}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">{formatDate(comment.createdAt)}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted">
                    {comment.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-7 text-text-secondary">{comment.body}</p>
                {comment.guide ? (
                  <Link
                    to={`/guides/${comment.guide.slug}`}
                    className="mt-4 inline-flex text-sm font-semibold text-neon-cyan transition hover:text-white"
                  >
                    View guide
                  </Link>
                ) : null}
              </Card>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
