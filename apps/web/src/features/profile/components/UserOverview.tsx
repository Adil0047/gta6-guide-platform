import { useQuery } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import {
  Bookmark,
  Compass,
  MessageCircle,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router';

import { GuideCard, StatCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ROUTES } from '@/constants/routes';
import { queryKeys, userService, type UserDashboard } from '@/services';
import { formatDate } from '@/utils/formatDate';

type ActivityItem = {
  id: string;
  label: string;
  title: string;
  description: string;
  to: string;
  createdAt: string;
};

function getInitials(name: string, username: string) {
  const source = name || username;
  const initials = source
    .split(' ')
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');

  return initials.toUpperCase() || 'P';
}

function createActivityItems(dashboard: UserDashboard): ActivityItem[] {
  const bookmarkItems = dashboard.recentBookmarks
    .filter((bookmark) => Boolean(bookmark.guide))
    .map((bookmark) => ({
      id: `bookmark-${bookmark.id}`,
      label: 'Bookmark',
      title: bookmark.guide?.title ?? 'Saved guide',
      description: 'Saved to your guide library.',
      to: bookmark.guide ? `${ROUTES.guides}/${bookmark.guide.slug}` : ROUTES.guides,
      createdAt: bookmark.createdAt,
    }));

  const commentItems = dashboard.recentComments
    .filter((comment) => Boolean(comment.guide))
    .map((comment) => ({
      id: `comment-${comment.id}`,
      label: 'Comment',
      title: comment.guide?.title ?? 'Guide discussion',
      description: comment.body,
      to: comment.guide ? `${ROUTES.guides}/${comment.guide.slug}` : ROUTES.guides,
      createdAt: comment.createdAt,
    }));

  const viewedItems = dashboard.recentlyViewedGuides
    .filter((item) => Boolean(item.guide))
    .map((item) => ({
      id: `view-${item.id}`,
      label: 'Viewed',
      title: item.guide?.title ?? 'Recently viewed guide',
      description: 'Opened from your account.',
      to: item.guide ? `${ROUTES.guides}/${item.guide.slug}` : ROUTES.guides,
      createdAt: item.viewedAt,
    }));

  return [...bookmarkItems, ...commentItems, ...viewedItems]
    .sort(
      (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    )
    .slice(0, 6);
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-panel border border-white/10 bg-white/[0.04] p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 rounded-card" />
        ))}
      </div>
    </div>
  );
}

function GuideListCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <div>
        <h2 className="text-xl font-black text-white">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
      </div>
      <div className="mt-5">{children}</div>
    </Card>
  );
}

export function UserOverview() {
  const dashboardQuery = useQuery({
    queryKey: queryKeys.userDashboard,
    queryFn: userService.getDashboard,
  });

  if (dashboardQuery.isLoading) {
    return <DashboardSkeleton />;
  }

  if (dashboardQuery.isError) {
    return (
      <ErrorState
        title="Could not load dashboard"
        description="The profile dashboard API did not respond successfully. Sign in again or check the backend server."
      />
    );
  }

  const dashboard = dashboardQuery.data;

  if (!dashboard) {
    return (
      <EmptyState
        icon={<UserRound aria-hidden className="size-8" />}
        title="No profile found"
        description="The backend did not return a user dashboard for this session."
      />
    );
  }

  const { user, stats } = dashboard;
  const initials = getInitials(user.name, user.username);
  const activity = createActivityItems(dashboard);
  const statsList = [
    {
      id: 'total-bookmarks',
      label: 'Bookmarks',
      value: String(stats.totalBookmarks),
      description: 'Saved guides in your library.',
      icon: Bookmark,
    },
    {
      id: 'total-comments',
      label: 'Comments',
      value: String(stats.totalComments),
      description: 'Discussion posts from your account.',
      icon: MessageCircle,
    },
    {
      id: 'recent-views',
      label: 'Recent views',
      value: String(stats.recentlyViewedCount),
      description: 'Guides opened while signed in.',
      icon: PlayCircle,
    },
    {
      id: 'published-comments',
      label: 'Published',
      value: String(stats.publishedCommentsCount),
      description: 'Approved comments visible to readers.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div>
      <SectionHeader
        eyebrow="Dashboard"
        title="Your GTA VI command center"
        description="Continue reading, review your activity, and jump back into saved guides from real account data."
      />

      <Card className="mt-8 overflow-hidden p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="size-16 rounded-3xl border border-neon-cyan/30 object-cover"
              />
            ) : (
              <div className="grid size-16 place-items-center rounded-3xl border border-neon-cyan/30 bg-neon-cyan/10 text-xl font-black text-neon-cyan">
                {initials}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black tracking-tight text-white">
                  Welcome back, {user.name}
                </h2>
                <Badge variant="cyan">{user.role}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                @{user.username} · Joined {user.createdAt ? formatDate(user.createdAt) : 'recently'}
              </p>
              {user.bio ? (
                <p className="mt-2 text-sm leading-6 text-text-secondary">{user.bio}</p>
              ) : null}
            </div>
          </div>
          {typeof stats.profileCompletion === 'number' ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-text-secondary">
              <span className="font-bold text-white">{stats.profileCompletion}%</span> profile
              complete
            </div>
          ) : null}
        </div>
      </Card>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statsList.map((stat) => (
          <StatCard
            key={stat.id}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={<stat.icon aria-hidden className="size-5" />}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <GuideListCard
          title="Continue reading"
          description="Recently viewed guides are stored when you open a guide while signed in."
        >
          {dashboard.recentlyViewedGuides.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentlyViewedGuides.map((item) =>
                item.guide ? (
                  <Link
                    key={item.id}
                    to={`${ROUTES.guides}/${item.guide.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-neon-cyan/30 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{item.guide.title}</p>
                      <span className="text-xs text-text-muted">{formatDate(item.viewedAt)}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {item.guide.excerpt}
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Compass aria-hidden className="size-8" />}
              title="No recently viewed guides"
              description="Start exploring guides while signed in and your continue-reading list will appear here."
              action={
                <Link
                  to={ROUTES.guides}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="text-black group-hover:text-black">Start exploring guides</span>
                </Link>
              }
            />
          )}
        </GuideListCard>

        <GuideListCard
          title="Recent bookmarks"
          description="Your latest saved guides from the bookmark database."
        >
          {dashboard.recentBookmarks.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentBookmarks.map((bookmark) =>
                bookmark.guide ? (
                  <Link
                    key={bookmark.id}
                    to={`${ROUTES.guides}/${bookmark.guide.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-neon-pink/30 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{bookmark.guide.title}</p>
                      <span className="text-xs text-text-muted">
                        {formatDate(bookmark.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {bookmark.guide.excerpt}
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          ) : (
            <EmptyState
              icon={<Bookmark aria-hidden className="size-8" />}
              title="No bookmarks yet"
              description="Save guides you want to revisit and they will show up here."
              action={
                <Link
                  to={ROUTES.guides}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="text-black group-hover:text-black">Browse guides</span>
                </Link>
              }
            />
          )}
        </GuideListCard>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-2">
        <GuideListCard
          title="Recent comments"
          description="Newest comments and moderation states from your account."
        >
          {dashboard.recentComments.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentComments.map((comment) =>
                comment.guide ? (
                  <Link
                    key={comment.id}
                    to={`${ROUTES.guides}/${comment.guide.slug}`}
                    className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-neon-purple/30 hover:bg-white/[0.07]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{comment.guide.title}</p>
                      <Badge variant="neutral" className="tracking-normal">
                        {comment.status}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                      {comment.body}
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          ) : (
            <EmptyState
              icon={<MessageCircle aria-hidden className="size-8" />}
              title="No comments yet"
              description="Join a guide discussion and your latest comments will appear here."
              action={
                <Link
                  to={ROUTES.guides}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="text-black group-hover:text-black">Find a guide</span>
                </Link>
              }
            />
          )}
        </GuideListCard>

        <GuideListCard
          title="Activity"
          description="Bookmarks, comments, and viewed guides sorted newest first."
        >
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="block rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:border-neon-cyan/30 hover:bg-white/[0.07]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="purple" className="tracking-normal">
                      {item.label}
                    </Badge>
                    <span className="text-xs text-text-muted">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Sparkles aria-hidden className="size-8" />}
              title="No activity yet"
              description="Your bookmarks, comments, and guide views will create a timeline once you start using the site."
            />
          )}
        </GuideListCard>
      </div>

      <div className="mt-8">
        <GuideListCard
          title="Recommended guides"
          description="Based on your categories, tags, and popular published guides."
        >
          {dashboard.recommendations.length > 0 ? (
            <div className="grid gap-5 xl:grid-cols-2">
              {dashboard.recommendations.map((guide) => (
                <GuideCard
                  key={guide.id}
                  title={guide.title}
                  slug={guide.slug}
                  excerpt={guide.excerpt}
                  category={guide.categoryLabel}
                  readTime={guide.readTime}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Compass aria-hidden className="size-8" />}
              title="No recommendations yet"
              description="Explore and bookmark a few guides so recommendations can use your real activity."
              action={
                <Link
                  to={ROUTES.guides}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-medium text-black shadow-[0_0_32px_rgba(255,60,172,0.22)] transition hover:bg-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span className="text-black group-hover:text-black">Explore guides</span>
                </Link>
              }
            />
          )}
        </GuideListCard>
      </div>
    </div>
  );
}
