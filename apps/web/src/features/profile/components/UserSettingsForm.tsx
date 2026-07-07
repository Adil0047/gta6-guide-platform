import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useEffect, useState } from 'react';

import { SectionHeader } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { FormField } from '@/components/forms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Skeleton } from '@/components/ui/Skeleton';
import { Spinner } from '@/components/ui/Spinner';
import { updateAuthSessionUser } from '@/features/auth/authSession';
import { queryKeys, userService } from '@/services';
import { formatDate } from '@/utils/formatDate';

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

export function UserSettingsForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [notificationPreference, setNotificationPreference] = useState('editorial');
  const [saved, setSaved] = useState(false);

  const userQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: userService.getMe,
  });
  const dashboardQuery = useQuery({
    queryKey: queryKeys.userDashboard,
    queryFn: userService.getDashboard,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userService.updateMe,
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.me });
      const previousUser = queryClient.getQueryData(queryKeys.me);

      queryClient.setQueryData(queryKeys.me, (currentUser: typeof userQuery.data) =>
        currentUser ? { ...currentUser, ...input } : currentUser,
      );

      return { previousUser };
    },
    onError: (_error, _input, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(queryKeys.me, context.previousUser);
      }
    },
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.me, user);
      updateAuthSessionUser(user);
      setSaved(true);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
      void queryClient.invalidateQueries({ queryKey: queryKeys.userDashboard });
    },
  });

  useEffect(() => {
    if (!userQuery.data) {
      return;
    }

    setName(userQuery.data.name);
    setUsername(userQuery.data.username);
    setBio(userQuery.data.bio ?? '');
    setAvatar(userQuery.data.avatar ?? '');
    setNotificationPreference(
      userQuery.data.preferences &&
        typeof userQuery.data.preferences === 'object' &&
        'notifications' in userQuery.data.preferences
        ? 'all'
        : 'editorial',
    );
  }, [userQuery.data]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(false);

    updateProfileMutation.mutate({
      name,
      username,
      bio,
      avatar,
      preferences: {
        notifications: {
          editorial: notificationPreference !== 'none',
          product: notificationPreference === 'all',
          comments: notificationPreference === 'all',
        },
      },
    });
  }

  const user = userQuery.data;
  const stats = dashboardQuery.data?.stats;

  return (
    <div>
      <SectionHeader
        eyebrow="Settings"
        title="Profile preferences"
        description="Manage account fields persisted through the backend profile endpoint."
      />

      <Card className="mt-8 p-6">
        {userQuery.isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-3xl" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-72 max-w-full" />
            </div>
          </div>
        ) : null}

        {user ? (
          <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="size-20 rounded-3xl border border-neon-cyan/30 object-cover" />
            ) : (
              <div className="grid size-20 place-items-center rounded-3xl border border-neon-cyan/30 bg-neon-cyan/10 text-2xl font-black text-neon-cyan">
                {getInitials(user.name, user.username)}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-black text-white">{user.name}</h2>
                <Badge variant="cyan">{user.role}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                @{user.username} · {user.email} · Joined {user.createdAt ? formatDate(user.createdAt) : 'recently'}
              </p>
              <p className="mt-3 text-sm leading-7 text-text-secondary">
                {user.bio || 'Add a short bio to complete your public profile.'}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Bookmarks</p>
                  <p className="mt-2 text-2xl font-black text-white">{stats?.totalBookmarks ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Comments</p>
                  <p className="mt-2 text-2xl font-black text-white">{stats?.totalComments ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Completion</p>
                  <p className="mt-2 text-2xl font-black text-white">{stats?.profileCompletion === undefined ? '—' : `${stats.profileCompletion}%`}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Card>

      <Card className="mt-8 p-6">
        {userQuery.isLoading ? (
          <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
            <Spinner />
            Loading profile settings…
          </div>
        ) : null}

        {userQuery.isError ? (
          <ErrorState
            title="Could not load settings"
            description="The profile API did not respond successfully. Sign in again or check the backend server."
          />
        ) : null}

        {!userQuery.isLoading && !userQuery.isError ? (
          <form onSubmit={handleSubmit} className="grid gap-5">
            <FormField label="Display name">
              {(id) => (
                <Input
                  id={id}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                />
              )}
            </FormField>

            <FormField label="Username">
              {(id) => (
                <Input
                  id={id}
                  value={username}
                  onChange={(event) => {
                    setUsername(event.target.value);
                  }}
                />
              )}
            </FormField>

            <FormField label="Bio">
              {(id) => (
                <Input
                  id={id}
                  value={bio}
                  onChange={(event) => {
                    setBio(event.target.value);
                  }}
                />
              )}
            </FormField>

            <FormField label="Avatar URL">
              {(id) => (
                <Input
                  id={id}
                  value={avatar}
                  placeholder="https://example.com/avatar.png"
                  onChange={(event) => {
                    setAvatar(event.target.value);
                  }}
                />
              )}
            </FormField>

            <FormField label="Notification preference">
              {(id) => (
                <Select
                  id={id}
                  value={notificationPreference}
                  onChange={(event) => {
                    setNotificationPreference(event.target.value);
                  }}
                >
                  <option value="editorial">Editorial updates only</option>
                  <option value="all">All product updates</option>
                  <option value="none">No notifications</option>
                </Select>
              )}
            </FormField>

            <Button type="submit" className="w-full sm:w-fit" disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? 'Saving…' : 'Save settings'}
            </Button>

            {saved ? (
              <p className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">
                Profile settings saved through the backend API.
              </p>
            ) : null}

            {updateProfileMutation.isError ? (
              <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
                Profile update failed. Check your values and try again.
              </p>
            ) : null}
          </form>
        ) : null}
      </Card>
    </div>
  );
}
