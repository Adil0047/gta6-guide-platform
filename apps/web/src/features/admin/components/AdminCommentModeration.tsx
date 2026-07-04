import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, MessageCircle, Trash2, XCircle } from 'lucide-react';

import { COMMENT_STATUSES, type CommentStatus } from '@gta6-guide/shared/community';

import { EmptyState, ErrorState } from '@/components/feedback';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { commentService, queryKeys } from '@/services';
import { formatDate } from '@/utils/formatDate';

export function AdminCommentModeration() {
  const queryClient = useQueryClient();
  const commentsKey = queryKeys.adminComments({ limit: 50 });
  const commentsQuery = useQuery({
    queryKey: commentsKey,
    queryFn: () => commentService.listComments({ limit: 50 }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommentStatus }) =>
      commentService.updateCommentStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: commentsKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: commentService.deleteComment,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: commentsKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  const comments = commentsQuery.data?.items ?? [];

  if (commentsQuery.isLoading) {
    return (
      <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
          <Spinner />
          Loading comment records…
        </div>
      </div>
    );
  }

  if (commentsQuery.isError) {
    return (
      <ErrorState
        title="Could not load comments"
        description="The comment moderation API did not return records successfully."
      />
    );
  }

  if (comments.length === 0) {
    return (
      <EmptyState
        icon={<MessageCircle aria-hidden className="size-8" />}
        title="No comments found"
        description="Comments submitted from guide pages will appear here for moderation."
      />
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-base font-bold text-white">
                  {comment.guide?.title ?? 'Guide unavailable'}
                </h2>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted">
                  {comment.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {comment.user?.name ?? comment.user?.username ?? 'Unknown user'} · {formatDate(comment.createdAt)}
              </p>
              <p className="mt-4 text-sm leading-7 text-text-secondary">{comment.body}</p>
            </div>

            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button
                variant="ghost"
                className="h-9 px-3 text-xs"
                onClick={() => {
                  updateStatusMutation.mutate({ id: comment.id, status: COMMENT_STATUSES.APPROVED });
                }}
                disabled={updateStatusMutation.isPending || comment.status === COMMENT_STATUSES.APPROVED}
              >
                <CheckCircle2 aria-hidden className="mr-2 size-4" />
                Approve
              </Button>
              <Button
                variant="ghost"
                className="h-9 px-3 text-xs"
                onClick={() => {
                  updateStatusMutation.mutate({ id: comment.id, status: COMMENT_STATUSES.REJECTED });
                }}
                disabled={updateStatusMutation.isPending || comment.status === COMMENT_STATUSES.REJECTED}
              >
                <XCircle aria-hidden className="mr-2 size-4" />
                Reject
              </Button>
              <Button
                variant="ghost"
                className="h-9 px-3 text-xs text-danger"
                onClick={() => {
                  deleteCommentMutation.mutate(comment.id);
                }}
                disabled={deleteCommentMutation.isPending}
              >
                <Trash2 aria-hidden className="mr-2 size-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
