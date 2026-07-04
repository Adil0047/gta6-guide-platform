import { useQuery } from '@tanstack/react-query';
import { MailCheck, ShieldCheck, UserRound } from 'lucide-react';

import { StatCard } from '@/components/cards';
import { SectionHeader } from '@/components/common';
import { EmptyState, ErrorState } from '@/components/feedback';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { queryKeys, userService } from '@/services';

export function UserOverview() {
  const userQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: userService.getMe,
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
      id: 'profile-status',
      label: 'Status',
      value: user.status,
      description: 'Live account status from MongoDB.',
      icon: UserRound,
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
        description={`Welcome back, ${user.name}. Your profile data is loaded from the backend user API.`}
      />

      <div className="mt-8 grid gap-5 md:grid-cols-3">
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
        <EmptyState
          title="Bookmarks waiting for persistence"
          description="The bookmark model and endpoints are planned for the next persistence phase, so no local placeholder bookmarks are shown here."
        />
        <EmptyState
          title="Comments waiting for persistence"
          description="The comment model and moderation endpoints are planned for the next persistence phase, so no local placeholder comments are shown here."
        />
      </div>
    </div>
  );
}
