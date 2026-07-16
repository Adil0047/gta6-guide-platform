import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Trash2 } from 'lucide-react';
import { Link } from 'react-router';

import { GuideCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { bookmarkService, queryKeys } from '@/services';
import { formatDate } from '@/utils/formatDate';

export function UserBookmarkList() {
  const queryClient = useQueryClient();
  const bookmarksKey = queryKeys.bookmarks({ limit: 50 });
  const bookmarksQuery = useQuery({
    queryKey: bookmarksKey,
    queryFn: () => bookmarkService.listBookmarks({ limit: 50 }),
  });

  const removeBookmarkMutation = useMutation({
    mutationFn: bookmarkService.deleteBookmark,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: bookmarksKey });
      void queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });

  const bookmarks = bookmarksQuery.data?.items ?? [];

  return (
    <div>
      <SectionHeader
        eyebrow="Bookmarks"
        title="Saved guides"
        description="A fast-access library for guides you saved from the live backend bookmark API."
      />

      <div className="mt-8">
        {bookmarksQuery.isLoading ? (
          <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
            <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
              <Spinner />
              Loading saved guides…
            </div>
          </div>
        ) : null}

        {bookmarksQuery.isError ? (
          <ErrorState
            title="Could not load bookmarks"
            description="The bookmark API did not return saved guides successfully."
          />
        ) : null}

        {!bookmarksQuery.isLoading && !bookmarksQuery.isError && bookmarks.length === 0 ? (
          <EmptyState
            icon={<Bookmark aria-hidden className="size-8" />}
            title="No saved guides yet"
            description="Open any guide and save it to keep it here for quick access."
          />
        ) : null}

        {!bookmarksQuery.isLoading && !bookmarksQuery.isError && bookmarks.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {bookmarks.map((bookmark) =>
              bookmark.guide ? (
                <div
                  key={bookmark.id}
                  className="rounded-card border border-white/10 bg-white/[0.04] p-5"
                >
                  <GuideCard
                    title={bookmark.guide.title}
                    slug={bookmark.guide.slug}
                    excerpt={bookmark.guide.excerpt}
                    category={bookmark.guide.categoryLabel}
                    readTime={bookmark.guide.readTime}
                  />
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-text-muted">
                    <span>Saved {formatDate(bookmark.createdAt)}</span>
                    <Button
                      variant="ghost"
                      className="h-9 px-3 text-xs text-danger"
                      onClick={() => {
                        removeBookmarkMutation.mutate(bookmark.guide?.id ?? '');
                      }}
                      disabled={removeBookmarkMutation.isPending}
                    >
                      <Trash2 aria-hidden className="mr-2 size-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={bookmark.id}
                  className="rounded-card border border-white/10 bg-white/[0.04] p-5"
                >
                  <p className="text-sm text-text-secondary">
                    This saved guide is no longer available.
                  </p>
                  <Link
                    className="mt-3 inline-block text-sm font-semibold text-neon-cyan"
                    to="/guides"
                  >
                    <span className="text-black">Browse guides</span>
                  </Link>
                </div>
              ),
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
