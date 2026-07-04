import { MessageCircle } from 'lucide-react';

import { SectionHeader } from '@/components/common';
import { EmptyState } from '@/components/feedback';

export function UserCommentList() {
  return (
    <div>
      <SectionHeader
        eyebrow="Comments"
        title="Your discussions"
        description="Track your guide comments, moderation state, and future community activity."
      />

      <div className="mt-8">
        <EmptyState
          icon={<MessageCircle aria-hidden className="size-8" />}
          title="No comments yet"
          description="Comment persistence is reserved for the backend comment API. Once that endpoint exists, this page will render your server-side discussion history."
        />
      </div>
    </div>
  );
}
