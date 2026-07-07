import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  clearAuthSession,
  getAuthSession,
  isAdminRole,
  shouldRestoreAuthSession,
  subscribeAuthSession,
  type AuthSession,
  type AuthUser,
} from '@/features/auth/authSession';
import { authService, queryKeys } from '@/services';

type AuthContextValue = {
  session: AuthSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isRestoring: boolean;
  refreshSession: () => Promise<AuthSession | null>;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function removeAuthScopedQueries(queryClient: QueryClient) {
  queryClient.removeQueries({ queryKey: queryKeys.me });
  queryClient.removeQueries({ queryKey: ['bookmarks'] });
  queryClient.removeQueries({ queryKey: ['comments', 'me'] });
  queryClient.removeQueries({ queryKey: ['admin'] });
  queryClient.removeQueries({ queryKey: ['users'] });
}

function invalidateAuthScopedQueries(queryClient: QueryClient) {
  void queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
  void queryClient.invalidateQueries({ queryKey: ['comments', 'me'] });
  void queryClient.invalidateQueries({ queryKey: ['admin'] });
  void queryClient.invalidateQueries({ queryKey: ['users'] });
}

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(() => getAuthSession());
  const [isRestoring, setIsRestoring] = useState(() => shouldRestoreAuthSession());

  const syncSession = useCallback(
    (nextSession: AuthSession | null) => {
      setSession(nextSession);

      if (nextSession) {
        queryClient.setQueryData(queryKeys.me, nextSession.user);
        return;
      }

      removeAuthScopedQueries(queryClient);
    },
    [queryClient],
  );

  const refreshSession = useCallback(async () => {
    if (!shouldRestoreAuthSession()) {
      clearAuthSession();
      syncSession(null);
      return null;
    }

    setIsRestoring(true);

    try {
      const restoredSession = await authService.refresh();
      syncSession(restoredSession);
      invalidateAuthScopedQueries(queryClient);

      return restoredSession;
    } catch {
      clearAuthSession();
      syncSession(null);

      return null;
    } finally {
      setIsRestoring(false);
    }
  }, [queryClient, syncSession]);

  useEffect(() => subscribeAuthSession(syncSession), [syncSession]);

  useEffect(() => {
    let isMounted = true;

    async function restore() {
      if (!shouldRestoreAuthSession()) {
        if (isMounted) {
          setIsRestoring(false);
        }

        return;
      }

      try {
        const restoredSession = await authService.refresh();

        if (!isMounted) {
          return;
        }

        syncSession(restoredSession);
        invalidateAuthScopedQueries(queryClient);
      } catch {
        clearAuthSession();

        if (isMounted) {
          syncSession(null);
        }
      } finally {
        if (isMounted) {
          setIsRestoring(false);
        }
      }
    }

    void restore();

    return () => {
      isMounted = false;
    };
  }, [queryClient, syncSession]);

  const value = useMemo<AuthContextValue>(() => {
    const user = session?.user ?? null;

    return {
      session,
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user ? isAdminRole(user.role) : false,
      isRestoring,
      refreshSession,
    };
  }, [isRestoring, refreshSession, session]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context) {
    return context;
  }

  const fallbackSession = getAuthSession();
  const fallbackUser = fallbackSession?.user ?? null;

  return {
    session: fallbackSession,
    user: fallbackUser,
    isAuthenticated: Boolean(fallbackUser),
    isAdmin: fallbackUser ? isAdminRole(fallbackUser.role) : false,
    isRestoring: false,
    refreshSession: async () => fallbackSession,
  } satisfies AuthContextValue;
}
