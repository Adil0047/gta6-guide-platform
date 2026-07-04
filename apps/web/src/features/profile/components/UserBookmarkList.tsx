import { Bookmark } from 'lucide-react';

import { SectionHeader } from '@/components/common';
import { EmptyState } from '@/components/feedback';

export function UserBookmarkList() {
  return (
    <div>
      <SectionHeader
        eyebrow="Bookmarks"
        title="Saved guides"
        description="A fast-access library for guides you want to revisit during missions, exploration, or progression planning."
      />

      <div className="mt-8">
        <EmptyState
          icon={<Bookmark aria-hidden className="size-8" />}
          title="No saved guides yet"
          description="Bookmark persistence is reserved for the backend bookmark API. Once that endpoint exists, this page will render saved guide records from the server."
        />
      </div>
    </div>
  );
}
