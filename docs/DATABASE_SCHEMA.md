# Database Schema Documentation

MongoDB collections are managed through Mongoose models in `apps/api/src/models`.

## User

Stores account and profile data.

Key fields:

- `name`, `username`, `email`
- `passwordHash` with `select: false`
- `role`: `user`, `editor`, `admin`, `superAdmin`
- `status`: `active`, `suspended`, `deleted`
- `refreshTokenVersion`
- `preferences`

Indexes:

- `email`
- `username`
- `email + status`
- `username + status`

## RefreshToken

Stores hashed refresh tokens for rotation and revocation.

Key fields:

- `userId`
- `tokenHash`
- `expiresAt`
- `revokedAt`
- `createdByIp`, `revokedByIp`, `userAgent`

Indexes:

- `userId`
- `tokenHash`
- TTL index on `expiresAt`

## Category

Stores guide taxonomy.

Key fields:

- `title`, `slug`, `description`
- `accent`: `pink`, `cyan`, `purple`
- `isActive`
- `order`
- `seo`

Indexes:

- unique `slug`
- `slug + isActive`
- `isActive + order + title`
- text index on `title` and `description`

## Guide

Stores editorial guide content.

Key fields:

- `title`, `slug`, `excerpt`, `content`
- `sections`, `faqs`
- `categoryId`, `authorId`, `reviewerId`
- `tags`, `tagIds`
- `type`, `difficulty`, `status`, `visibility`
- `metrics`
- `seo`
- `gameMeta`

Indexes:

- unique `slug`
- text index on title/excerpt/content/tags/game metadata
- `status + publishedAt`
- `categoryId + status + publishedAt`
- `isFeatured + status + publishedAt`
- `status + type + publishedAt`
- `status + difficulty + publishedAt`
- `status + metrics.viewCount + publishedAt`

## Bookmark

Stores user saved-guide relationships.

Key fields:

- `userId`
- `guideId`

Indexes:

- unique `userId + guideId`
- `userId + createdAt`

## Comment

Stores guide discussion and moderation state.

Key fields:

- `guideId`
- `userId`
- `parentId`
- `body`
- `status`: `pending`, `approved`, `rejected`, `spam`
- `isEdited`

Indexes:

- `guideId + status + createdAt`
- `userId + createdAt`
- `status + createdAt`

## AuditLog

Stores admin and system audit events.

Key fields:

- `actorId`
- `action`
- `resourceType`
- `resourceId`
- `metadata`
- `ip`, `userAgent`

Indexes:

- `actorId`
- `action`
- `resourceType`
- `resourceId`
- `createdAt`
