import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useEffect, useState } from 'react';

import { SectionHeader } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { FormField } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { queryKeys, userService } from '@/services';

export function UserSettingsForm() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [notificationPreference, setNotificationPreference] = useState('editorial');
  const [saved, setSaved] = useState(false);

  const userQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: userService.getMe,
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
      setSaved(true);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });

  useEffect(() => {
    if (!userQuery.data) {
      return;
    }

    setName(userQuery.data.name);
    setUsername(userQuery.data.username);
    setBio(userQuery.data.bio ?? '');
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
      preferences: {
        notifications: {
          editorial: notificationPreference !== 'none',
          product: notificationPreference === 'all',
          comments: notificationPreference === 'all',
        },
      },
    });
  }

  return (
    <div>
      <SectionHeader
        eyebrow="Settings"
        title="Profile preferences"
        description="Manage account fields persisted through the backend profile endpoint."
      />

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
