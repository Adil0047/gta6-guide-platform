export const COMMENT_STATUS_VALUES = ['pending', 'approved', 'rejected', 'spam'] as const;

export type CommentStatus = (typeof COMMENT_STATUS_VALUES)[number];

export const COMMENT_STATUSES = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SPAM: 'spam',
} as const satisfies Record<string, CommentStatus>;
