import { useQuery } from '@tanstack/react-query';
import { Bookmark, MailCheck, MessageCircle, ShieldCheck, UserRound } from 'lucide-react';
import { Link } from 'react-router';

import { StatCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { bookmarkService, commentService, queryKeys, userService } from '@/services';

export function UserOverview() {
  const userQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: userService.getMe,
  });
  const bookmarksQuery = useQuery({
    queryKey: queryKeys.bookmarks({ limit: 3 }),
    queryFn: () => bookmarkService.listBookmarks({ limit: 3 }),
  });
  const commentsQuery = useQuery({
    queryKey: queryKeys.myComments({ limit: 3 }),
    queryFn: () => commentService.listMyComments({ limit: 3 }),
  });

  if (userQuery.isLoading) {
    return (
      <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
        <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
          <Spinner />
          Loading dashboard profile…
        </div>
      </div>
    );
  }

  if (userQuery.isError) {
    return (
      <ErrorState
        title="Could not load dashboard"
        description="The profile API did not respond successfully. Sign in again or check the backend server."
      />
    );
  }

  const user = userQuery.data;

  if (!user) {
    return (
      <EmptyState
        icon={<UserRound aria-hidden className="size-8" />}
        title="No profile found"
        description="The backend did not return a user profile for this session."
      />
    );
  }

  const stats = [
    {
      id: 'profile-role',
      label: 'Role',
      value: user.role,
      description: 'Backend-authorized account role.',
      icon: ShieldCheck,
    },
    {
      id: 'profile-bookmarks',
      label: 'Saved guides',
      value: String(bookmarksQuery.data?.meta?.total ?? 0),
      description: 'Persisted bookmark records.',
      icon: Bookmark,
    },
    {
      id: 'profile-comments',
      label: 'Comments',
      value: String(commentsQuery.data?.meta?.total ?? 0),
      description: 'Persisted discussion records.',
      icon: MessageCircle,
    },
    {
      id: 'profile-email',
      label: 'Email',
      value: user.isEmailVerified ? 'Verified' : 'Pending',
      description: 'Email verification state from the user API.',
      icon: MailCheck,
    },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Dashboard"
        title="Your GTA VI command center"
        description={`Welcome back, ${user.name}. Your profile, bookmarks, and comments are loaded from backend APIs.`}
      />

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={<stat.icon aria-hidden className="size-5" />}
          />
        ))}
      </div>

      <Card className="mt-8 p-6">
        <div className="flex items-start gap-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
            <UserRound aria-hidden className="size-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Profile snapshot</h2>
            <p className="mt-2 text-sm leading-7 text-text-secondary">
              @{user.username} · {user.email}
            </p>
            {user.bio ? <p className="mt-3 text-sm leading-7 text-text-secondary">{user.bio}</p> : null}
          </div>
        </div>
      </Card>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-black text-white">Recent bookmarks</h2>
          {bookmarksQuery.isLoading ? <p className="mt-4 text-sm text-text-secondary">Loading bookmarks…</p> : null}
          {bookmarksQuery.data?.items.length ? (
            <div className="mt-4 space-y-3">
              {bookmarksQuery.data.items.map((bookmark) => (
                <Link
                  key={bookmark.id}
                  to={bookmark.guide ? `/guides/${bookmark.guide.slug}` : '/guides'}
                  className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  {bookmark.guide?.title ?? 'Unavailable guide'}
                </Link>
              ))}
            </div>
          ) : null}
          {!bookmarksQuery.isLoading && !bookmarksQuery.data?.items.length ? (
            <p className="mt-4 text-sm leading-7 text-text-secondary">No saved guides yet.</p>
          ) : null}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-white">Recent comments</h2>
          {commentsQuery.isLoading ? <p className="mt-4 text-sm text-text-secondary">Loading comments…</p> : null}
          {commentsQuery.data?.items.length ? (
            <div className="mt-4 space-y-3">
              {commentsQuery.data.items.map((comment) => (
                <div key={comment.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">{comment.guide?.title ?? 'Guide unavailable'}</p>
                    <span className="text-xs text-text-muted">{comment.status}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">{comment.body}</p>
                </div>
              ))}
            </div>
          ) : null}
          {!commentsQuery.isLoading && !commentsQuery.data?.items.length ? (
            <p className="mt-4 text-sm leading-7 text-text-secondary">No comments yet.</p>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
