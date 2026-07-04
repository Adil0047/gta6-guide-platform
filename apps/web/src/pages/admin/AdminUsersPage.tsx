import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert } from 'lucide-react';

import { type UserDto } from '@gta6-guide/shared/dto';
import { type UserStatus } from '@gta6-guide/shared/users';

import { SEO } from '@/components/common';
import { ErrorState } from '@/components/feedback';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { AdminPageHeader, AdminRecordTable } from '@/features/admin';
import { adminService, createUserRecord, queryKeys, type PaginatedResult } from '@/services';

function getNextStatus(status: UserStatus): UserStatus {
  return status === 'active' ? 'suspended' : 'active';
}

export function AdminUsersPage() {
  const queryClient = useQueryClient();
  const usersKey = queryKeys.users({ limit: 50 });
  const usersQuery = useQuery({
    queryKey: usersKey,
    queryFn: () => adminService.listUsers({ limit: 50 }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: UserStatus }) =>
      adminService.updateUserStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: usersKey });
      const previousUsers = queryClient.getQueryData<PaginatedResult<UserDto>>(usersKey);

      queryClient.setQueryData<PaginatedResult<UserDto>>(usersKey, (current) =>
        current
          ? {
              ...current,
              items: current.items.map((user) => (user.id === id ? { ...user, status } : user)),
            }
          : current,
      );

      return { previousUsers };
    },
    onError: (_error, _input, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(usersKey, context.previousUsers);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: usersKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.adminOverview });
    },
  });

  const users = usersQuery.data?.items ?? [];
  const records = users.map(createUserRecord);

  return (
    <>
      <SEO title="Admin Users" description="Manage GTA VI Guide Platform users." />
      <main id="main-content" className="py-10 sm:py-12">
        <Container>
          <AdminPageHeader
            eyebrow="Users"
            title="User management"
            description="Review live users, roles, profile activity, moderation flags, and future premium access states."
          />

          <div className="mt-8">
            {usersQuery.isLoading ? (
              <div className="rounded-panel border border-white/10 bg-white/[0.04] p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-text-secondary">
                  <Spinner />
                  Loading user records…
                </div>
              </div>
            ) : null}

            {usersQuery.isError ? (
              <ErrorState
                title="Could not load users"
                description="The user API did not return admin records successfully."
              />
            ) : null}

            {!usersQuery.isLoading && !usersQuery.isError ? (
              <AdminRecordTable
                title="User records"
                records={records}
                actions={(record) => {
                  const user = users.find((item) => item.id === record.id);

                  if (!user) {
                    return null;
                  }

                  return (
                    <button
                      type="button"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-text-secondary transition hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      onClick={() => {
                        updateStatusMutation.mutate({ id: user.id, status: getNextStatus(user.status) });
                      }}
                      disabled={updateStatusMutation.isPending}
                    >
                      <ShieldAlert aria-hidden className="mr-2 size-4" />
                      {user.status === 'active' ? 'Limit' : 'Activate'}
                    </button>
                  );
                }}
              />
            ) : null}
          </div>
        </Container>
      </main>
    </>
  );
}
