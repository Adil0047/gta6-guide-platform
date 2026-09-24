import { CheckCircle2, Info } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import { FormField } from '@/components/forms';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { SITE_CONFIG } from '@/constants/site';

type AdminSettingsState = {
  siteName: string;
  defaultPublishingStatus: 'draft' | 'review' | 'published';
  commentModeration: 'manual' | 'trusted' | 'closed';
};

const DEFAULT_STATE: AdminSettingsState = {
  siteName: SITE_CONFIG.name,
  defaultPublishingStatus: 'draft',
  commentModeration: 'manual',
};

/**
 * Editorial admin settings form. Currently persists to LOCAL state only —
 * there is no backend admin-config endpoint yet. The form is intentionally
 * structured so a future `PUT /api/v1/admin/config` call can be wired into
 * the `handleSubmit` mutator without touching the field layout. The "Demo
 * state" banner makes the non-persisted status explicit to admins.
 */
export function AdminSettingsPanel() {
  const [state, setState] = useState<AdminSettingsState>(DEFAULT_STATE);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: wire to `adminService.updateConfig(state)` once the backend
    // admin-config endpoint exists. For now, persist to local state only.
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3000);
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Editorial defaults</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Configure publishing defaults and moderation preferences. Changes are saved to this
            session only until the backend admin-config endpoint ships.
          </p>
        </div>
        <Badge variant="purple">Demo state</Badge>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <FormField label="Site name">
          {(id) => (
            <Input
              id={id}
              value={state.siteName}
              onChange={(event) => {
                setState((current) => ({ ...current, siteName: event.target.value }));
                setSaved(false);
              }}
            />
          )}
        </FormField>

        <FormField label="Default publishing status">
          {(id) => (
            <Select
              id={id}
              value={state.defaultPublishingStatus}
              onChange={(event) => {
                setState((current) => ({
                  ...current,
                  defaultPublishingStatus: event.target.value as AdminSettingsState['defaultPublishingStatus'],
                }));
                setSaved(false);
              }}
            >
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </Select>
          )}
        </FormField>

        <FormField label="Comment moderation">
          {(id) => (
            <Select
              id={id}
              value={state.commentModeration}
              onChange={(event) => {
                setState((current) => ({
                  ...current,
                  commentModeration: event.target.value as AdminSettingsState['commentModeration'],
                }));
                setSaved(false);
              }}
            >
              <option value="manual">Manual review</option>
              <option value="trusted">Auto-approve trusted users</option>
              <option value="closed">Disable comments</option>
            </Select>
          )}
        </FormField>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" className="w-full sm:w-fit">
            Save admin settings
          </Button>
          {saved ? (
            <span className="inline-flex items-center gap-2 text-sm text-neon-cyan">
              <CheckCircle2 aria-hidden className="size-4" />
              Settings saved to this session.
            </span>
          ) : null}
        </div>
      </form>

      <div className="mt-6 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-xs leading-5 text-text-muted">
        <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
        <p>
          This panel is a frontend scaffold. Wiring it to a real{' '}
          <code className="rounded bg-white/[0.06] px-1 py-0.5">PUT /api/v1/admin/config</code>{' '}
          endpoint requires a backend admin-config model + route — track in the platform roadmap.
          The SEO health panel below IS live (reads the committed SEO config).
        </p>
      </div>
    </Card>
  );
}
