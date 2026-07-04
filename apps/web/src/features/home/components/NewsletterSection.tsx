import { Mail } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Input } from '@/components/ui/Input';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittedEmail(email.trim());
    setEmail('');
  }

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="relative overflow-hidden rounded-shell border border-white/10 bg-white/[0.04] p-6 shadow-panel backdrop-blur-xl sm:p-10 lg:p-12">
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-neon-pink/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-neon-cyan/10 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-neon-cyan">
                <Mail aria-hidden className="size-6" />
              </div>
              <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Get guide updates before everyone else.
              </h2>
              <p className="mt-4 text-sm leading-7 text-text-secondary">
                Join the editorial update list for new walkthroughs, map routes, system guides, and
                future launch-ready features.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-panel border border-white/10 bg-background/50 p-4">
              <label htmlFor="newsletter-email" className="block text-sm font-semibold text-white">
                Email address
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  placeholder="you@example.com"
                  className="flex-1"
                />
                <Button type="submit">Notify me</Button>
              </div>
              {submittedEmail ? (
                <p className="mt-3 text-sm text-neon-cyan">
                  Updates will be prepared for {submittedEmail}.
                </p>
              ) : (
                <p className="mt-3 text-xs leading-5 text-text-muted">
                  No spam. Only meaningful guide and platform updates.
                </p>
              )}
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
