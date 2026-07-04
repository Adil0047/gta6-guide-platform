import { MessageCircle } from 'lucide-react';

import { EmptyState } from '@/components/feedback';

export function AdminCommentModeration() {
  return (
    <EmptyState
      icon={<MessageCircle aria-hidden className="size-8" />}
      title="Comment API not available yet"
      description="Local placeholder comments were removed. This moderation panel will render server-side comment records after the planned comment persistence endpoint is added."
    />
  );
}
