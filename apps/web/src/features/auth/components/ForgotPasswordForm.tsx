import { type FormEvent, useState } from 'react';

import { AuthInput } from '@/features/auth/components/AuthInput';
import { Button } from '@/components/ui/Button';

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthInput
        label="Email address"
        type="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        description="Enter the email linked to your account."
      />

      <Button type="submit" className="w-full">
        Send reset link
      </Button>

      {submitted ? (
        <p className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">
          Password reset request UI is ready for backend email integration.
        </p>
      ) : null}
    </form>
  );
}
