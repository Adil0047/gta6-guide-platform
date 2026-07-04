import { type FormEvent, useState } from 'react';

import { AuthInput } from '@/features/auth/components/AuthInput';
import { Button } from '@/components/ui/Button';

export function ResetPasswordForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AuthInput label="New password" type="password" autoComplete="new-password" required placeholder="Create a new password" />
      <AuthInput label="Confirm new password" type="password" autoComplete="new-password" required placeholder="Repeat new password" />

      <Button type="submit" className="w-full">
        Reset password
      </Button>

      {submitted ? (
        <p className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">
          Password reset confirmation UI is ready for backend token validation.
        </p>
      ) : null}
    </form>
  );
}
