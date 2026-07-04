import { useMutation } from '@tanstack/react-query';
import { type FormEvent, useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/constants/routes';
import { AuthInput } from '@/features/auth/components/AuthInput';
import { authService } from '@/services';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const registerMutation = useMutation({
    mutationFn: authService.register,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      return;
    }

    registerMutation.mutate({
      name,
      username,
      email,
      password,
    });
  }

  const passwordsMismatch = Boolean(confirmPassword) && password !== confirmPassword;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthInput
        label="Display name"
        type="text"
        autoComplete="name"
        required
        placeholder="Mia Vice"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
      <AuthInput
        label="Username"
        type="text"
        autoComplete="username"
        required
        placeholder="mia_vice"
        value={username}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
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
        autoComplete="new-password"
        required
        placeholder="Create a strong password"
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <AuthInput
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        required
        placeholder="Repeat password"
        value={confirmPassword}
        onChange={(event) => {
          setConfirmPassword(event.target.value);
        }}
      />

      <Button type="submit" className="w-full" disabled={registerMutation.isPending || passwordsMismatch}>
        {registerMutation.isPending ? 'Creating account…' : 'Create account'}
      </Button>

      {passwordsMismatch ? (
        <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          Passwords must match before creating an account.
        </p>
      ) : null}

      {registerMutation.isSuccess ? (
        <p className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">
          Account created. <Link to={ROUTES.login} className="font-bold underline">Sign in</Link> to continue.
        </p>
      ) : null}

      {registerMutation.isError ? (
        <p className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          Registration failed. Check your details and try again.
        </p>
      ) : null}
    </form>
  );
}
