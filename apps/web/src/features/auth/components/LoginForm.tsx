import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { AuthInput } from '@/features/auth/components/AuthInput';
import { authService, queryKeys } from '@/services';

export function LoginForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      queryClient.setQueryData(queryKeys.me, session.user);
      navigate(searchParams.get('redirectTo') ?? ROUTES.dashboard, { replace: true });
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    loginMutation.mutate({
      email,
      password,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthInput
        label="Email address"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <AuthInput
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />

      <div className="flex items-center justify-between gap-4">
        <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
          <input
            type="checkbox"
            className="size-4 rounded border-white/20 bg-white/[0.05] accent-neon-pink"
          />
          Remember me
        </label>

        <Link
          to={ROUTES.forgotPassword}
          className="text-sm font-semibold text-neon-cyan transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
        {loginMutation.isPending ? 'Signing in…' : 'Sign in'}
      </Button>

      {loginMutation.isError ? (
        <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          Login failed. Check your email and password, then try again.
        </p>
      ) : null}
    </form>
  );
}
