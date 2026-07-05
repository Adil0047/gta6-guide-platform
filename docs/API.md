# API Documentation

Base path: `/api/v1`

All responses use the shared envelope:

```json
{
  "success": true,
  "message": "Human readable status",
  "data": {},
  "meta": {}
}
```

Errors use:

```json
{
  "success": false,
  "message": "Error message",
  "details": {},
  "requestId": "optional request id"
}
```

## Authentication

### `POST /auth/register`
Create a user.

Body:

```json
{
  "name": "Jane Player",
  "username": "jane_player",
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### `POST /auth/login`
Returns `{ user, accessToken }` and sets a signed, HTTP-only refresh-token cookie.

Body:

```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### `POST /auth/refresh`
Reads the signed refresh-token cookie and returns a new access token.

### `POST /auth/logout`
Revokes the current refresh token and clears the cookie.

### `POST /auth/change-password`
Requires `Authorization: Bearer <accessToken>`.

Body:

```json
{
  "currentPassword": "Password123!",
  "newPassword": "NewPassword123!"
}
```

## Users

### `GET /users/me`
Returns the current authenticated profile.

### `PATCH /users/me`
Updates the current profile.

### `GET /users`
Admin-only. Supports pagination, `q`, `role`, and `status`.

### `PATCH /users/:id/status`
Admin-only. Updates a user status.

### `PATCH /users/:id/role`
Super-admin only. Updates a user role.

## Guides

### `GET /guides`
Public. Supports `page`, `limit`, `q`, `categoryId`, `categorySlug`, `difficulty`, `type`, `status`, `featured`, and `sort`.

Anonymous users only receive published guides. Editor/admin roles may also see drafts/review records.

### `GET /guides/:id`
Returns one guide by MongoDB id.

### `GET /guides/slug/:slug`
Returns one guide by slug and increments view count for public requests.

### `POST /guides`
Editor/admin-only. Creates a guide.

### `PATCH /guides/:id`
Editor/admin-only. Updates a guide.

### `DELETE /guides/:id`
Admin-only. Deletes a guide.

## Categories

### `GET /categories`
Public. Supports `page`, `limit`, `q`, and `isActive`.

### `GET /categories/:id`
Returns a category by id.

### `GET /categories/slug/:slug`
Returns a category by slug.

### `POST /categories`
Admin-only. Creates a category.

### `PATCH /categories/:id`
Admin-only. Updates a category.

### `DELETE /categories/:id`
Admin-only. Deletes a category.

## Search

### `GET /search`
Public. Supports `q`, `page`, `limit`, `categoryId`, `difficulty`, and `type`.

When `q` is missing or blank, the API returns HTTP 200 with an empty result set and pagination metadata.

Example:

```http
GET /api/v1/search?q=mission&limit=24
```

## Bookmarks

All bookmark routes require `Authorization: Bearer <accessToken>`.

### `GET /bookmarks`
Returns the current user's saved guides. Supports `page` and `limit`.

### `GET /bookmarks/guide/:guideId`
Returns `{ isBookmarked: boolean }`.

### `POST /bookmarks`
Saves a guide.

Body:

```json
{
  "guideId": "64f000000000000000000001"
}
```

### `DELETE /bookmarks/:guideId`
Removes a saved guide.

## Comments

### `GET /comments/guide/:guideId`
Public. Returns approved comments for a guide.

### `POST /comments`
Authenticated. Creates a pending comment.

Body:

```json
{
  "guideId": "64f000000000000000000001",
  "body": "Helpful walkthrough.",
  "parentId": "optional parent comment id"
}
```

### `GET /comments/me`
Authenticated. Returns the current user's comments.

### `GET /comments`
Admin-only. Supports `page`, `limit`, `guideId`, and `status`.

### `PATCH /comments/:id`
Authenticated owner or admin. Updates body and returns comment to pending moderation.

### `PATCH /comments/:id/status`
Admin-only. Updates moderation status to `pending`, `approved`, `rejected`, or `spam`.

### `DELETE /comments/:id`
Authenticated owner or admin. Deletes a comment.

## Admin

### `GET /admin/overview`
Admin-only. Returns guide/category/user/bookmark/comment counts and recent audit logs.

## Health

### `GET /health`
Public health-check endpoint used by Render.
