import { type FormEvent, useState } from 'react';

import { FormField } from '@/components/forms';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export function AdminSettingsPanel() {
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <FormField label="Site name">
          {(id) => <Input id={id} defaultValue="GTA VI Guide Platform" />}
        </FormField>

        <FormField label="Default publishing status">
          {(id) => (
            <Select id={id} defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="published">Published</option>
            </Select>
          )}
        </FormField>

        <FormField label="Comment moderation">
          {(id) => (
            <Select id={id} defaultValue="manual">
              <option value="manual">Manual review</option>
              <option value="trusted">Auto-approve trusted users</option>
              <option value="closed">Disable comments</option>
            </Select>
          )}
        </FormField>

        <FormField label="SEO indexing">
          {(id) => (
            <Select id={id} defaultValue="enabled">
              <option value="enabled">Enabled</option>
              <option value="staging">Staging only</option>
              <option value="disabled">Disabled</option>
            </Select>
          )}
        </FormField>

        <Button type="submit" className="w-full sm:w-fit">
          Save admin settings
        </Button>

        {saved ? (
          <p className="rounded-2xl border border-neon-cyan/20 bg-neon-cyan/10 px-4 py-3 text-sm text-neon-cyan">
            Admin settings UI saved for demo state.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
