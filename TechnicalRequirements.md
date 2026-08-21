# Collaborative Document Editor

## Technical Requirements

This document translates `CDE_MASTER_BLUEPRINT.md` into implementation-ready requirements. The blueprint remains the product source of truth. When the two documents differ, follow the blueprint and update this document to match.

## 1. Scope and Definition of Done

The required end-to-end flow is:

```text
Create document → edit rich text → save → refresh/reopen →
import .txt or .md → share with seeded user → switch user →
see document under Shared With Me → open shared document
```

The submission must use the name **Collaborative Document Editor**. Real-time collaboration, production authentication, comments, version history, DOCX, advanced roles, Redux, microservices, and other stretch features are out of scope.

## 2. Required Stack

### Frontend

- React with TypeScript, scaffolded with Vite.
- TipTap rich-text editor.
- TipTap StarterKit plus Underline; do not install duplicate heading or list extensions.
- A small Markdown parsing dependency is allowed for `.md` import.
- Local component state and a small API client; no global state library.

### Backend

- Python and Django.
- Django REST Framework.
- One Django application for users, documents, shares, API behavior, and tests.
- `django-cors-headers` only if the frontend and backend use different origins.

### Persistence

- SQLite is acceptable for local development.
- PostgreSQL is preferred for deployment because hosted SQLite files may be ephemeral.
- Database configuration must use environment variables in deployment.

## 3. Data Requirements

### TR-DATA-01: User

Use a small application-level seeded user model:

| Field | Requirement |
| --- | --- |
| `id` | Primary key |
| `name` | Required string |
| `email` | Required unique email |

At least Paul and Alex must be created by an idempotent management command or data migration. Passwords and production login are not required.

### TR-DATA-02: Document

| Field | Requirement |
| --- | --- |
| `id` | Primary key |
| `title` | Required trimmed string |
| `content` | JSON containing a valid TipTap document |
| `owner` | Foreign key to User |
| `created_at` | Creation timestamp |
| `updated_at` | Updated timestamp |

Default content:

```json
{
  "type": "doc",
  "content": [{ "type": "paragraph" }]
}
```

### TR-DATA-03: DocumentShare

| Field | Requirement |
| --- | --- |
| `id` | Primary key |
| `document` | Foreign key to Document |
| `user` | Foreign key to User |
| `created_at` | Creation timestamp |

The database must enforce uniqueness for `(document, user)`. Sharing a document with its owner is invalid.

## 4. Identity and Authorization Requirements

### TR-AUTH-01: Simulated identity

- The frontend sends `X-User-Id` on protected API requests.
- Missing or invalid identity returns `401` with a clear error.
- Switching users changes the header used by subsequent requests and reloads the visible document lists.

### TR-AUTH-02: Permission matrix

| Actor | Read | Update | Delete | Share |
| --- | --- | --- | --- | --- |
| Owner | Yes | Yes | Yes | Yes |
| Shared user | Yes | Yes | No | No |
| Other user | No | No | No | No |

Authorization must be enforced by the backend. Inaccessible documents should return `404` to avoid revealing their existence; forbidden owner-only actions on an otherwise accessible document may return `403`.

## 5. REST API Requirements

All bodies and responses use JSON unless stated otherwise.

### TR-API-01: Users

```text
GET /api/users/
```

Returns seeded users with `id`, `name`, and `email`.

### TR-API-02: Document list

```text
GET /api/documents/
```

Returns two arrays, `owned` and `shared`, for the current simulated user. List items include `id`, `title`, owner summary, and `updated_at`.

### TR-API-03: Create document

```text
POST /api/documents/
```

Accepts `title` and optional TipTap `content`. The current user becomes the owner. Returns `201` and the complete document.

### TR-API-04: Retrieve document

```text
GET /api/documents/:id/
```

Returns the complete accessible document, including content, owner summary, and shared-user summaries.

### TR-API-05: Update document

```text
PATCH /api/documents/:id/
```

Accepts `title`, `content`, or both. Owners and shared users may update. Returns the updated document.

### TR-API-06: Delete document

```text
DELETE /api/documents/:id/
```

Owner only. Returns `204`.

### TR-API-07: Import document

```text
POST /api/documents/import/
```

Accepts `filename` and TipTap `content`. The browser reads the selected `.txt` or `.md` file and converts it to editable content. The backend independently validates the extension, derives and validates the title, creates an owned document, and returns `201`. The original source file is not stored.

### TR-API-08: Share document

```text
POST /api/documents/:id/share/
```

Accepts `user_id`. Owner only. Returns `201` for a new share and a clear `400` for invalid targets, self-sharing, or duplicates.

### TR-API-09: Error shape

User-facing API failures should use a stable shape:

```json
{ "detail": "Understandable error message." }
```

## 6. Frontend Requirements

### TR-UI-01: Application shell

- Display the project name and active simulated user.
- Provide a user switcher populated from the API.
- Provide New Document and Import File actions.
- Show separate My Documents and Shared With Me sections.
- Show useful loading, empty, and API error states.

### TR-UI-02: Document editor

- Open an accessible document from either list.
- Rename it through a title input.
- Support bold, italic, underline, headings, bullet lists, and numbered lists.
- Persist TipTap JSON so formatting survives refresh and reopen.
- Use an explicit Save button as the required baseline.
- Display dirty, saving, saved, and failed-save states.
- Prevent or resolve unsaved changes before changing document or user.

### TR-UI-03: Sharing

- Show sharing controls only to the owner.
- Allow the owner to select a seeded user who is not already shared and is not the owner.
- Refresh document details/lists after a successful share.
- A shared user must see the document under Shared With Me and be able to open and edit it.

### TR-UI-04: Import

- The file picker accepts only `.txt` and `.md`.
- The UI states the supported formats.
- Reject unsupported extensions with an understandable message.
- Use the filename without its extension as the initial title.
- Create and immediately open the imported editable document.
- Do not implement custom Markdown parsing; use a small dependency or fall back to editable plain text.

## 7. Validation and Reliability Requirements

- Reject blank or whitespace-only titles.
- Reject unsupported import types and failed file reads.
- Reject malformed TipTap content with practical serializer validation.
- Reject invalid share targets, self-sharing, and duplicate shares.
- Surface network and server errors without raw stack traces.
- Do not overwrite one document with another document's content during switching.
- Do not carry one user's selected inaccessible document into another user's session.
- API base URLs, allowed hosts, CORS origins, database credentials, and debug mode must be environment-configurable.

## 8. Testing Requirements

At minimum, implement one backend API test proving that a shared user can access a document while an unshared user cannot. Prefer a third seeded/test user within the test fixture to prove denial independently.

If time remains, add tests proving:

- A non-owner cannot share or delete a document.
- A shared user can update content.
- Duplicate and self-sharing are rejected.

Manual verification must cover the full definition-of-done flow, formatting persistence, validation, and deployed behavior.

## 9. Deployment and Documentation Requirements

- Deploy early after create/edit/save/reopen works end to end.
- Use PostgreSQL in production unless setup threatens completion.
- Run migrations and the idempotent seed command in deployment.
- Verify the frontend's production API URL, CORS origin, and `X-User-Id` header.
- Complete `README.md`, `ARCHITECTURE.md`, `AI_WORKFLOW.md`, and `SUBMISSION.md`.
- Record known limitations honestly, including free-tier cold starts or persistence tradeoffs.
- Provide a live URL, seeded-user instructions, automated test instructions, and a 3–5 minute walkthrough.

## 10. Explicit Non-Requirements

Do not implement these until every required behavior is complete, deployed, tested, documented, and recorded:

- Real-time collaboration or WebSockets
- Production authentication, JWT, OAuth, registration, or password recovery
- Viewer/editor roles or advanced permissions
- Comments, suggestions, or version history
- DOCX import or PDF export
- Redux or another global state library
- Microservices or unnecessary abstractions
- Pixel-perfect Google Docs styling
- Autosave as a replacement for reliable explicit saving
