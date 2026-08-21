# Collaborative Document Editor

## Architecture

This implementation focuses on the smallest coherent collaborative document workflow that can be delivered reliably within the assessment timebox: rich-text document creation and editing, persistence, text/Markdown import, document ownership, sharing between simulated users, and backend-enforced access control.

## System Shape

- A React and TypeScript single-page frontend provides the document workspace and TipTap editor.
- A Django REST Framework backend owns persistence, validation, sharing rules, and authorization.
- The frontend communicates with the backend through a small JSON REST API.
- A seeded user identifier is sent with requests through `X-User-Id` to simulate identity without implementing production authentication.
- PostgreSQL is the primary database for local development and hosted persistence.
- Local configuration is loaded from an ignored `backend/.env`; hosted credentials are injected through `DATABASE_URL`.
- Backend environment loading uses `python-dotenv` at Django startup. The frontend has a separate environment file containing browser-visible `VITE_*` values only.
- `DATABASE_URL` is mandatory so a missing environment file cannot silently switch persistence engines.
- SQLite remains an emergency fallback only if PostgreSQL becomes a confirmed delivery blocker.
- Environment-specific service and API URLs are never embedded in application code. The frontend composes relative endpoint paths with `VITE_API_BASE_URL`; the backend receives origins, hosts, secrets, and database configuration through environment variables.

## Deliberate Scope Decisions

- Explicit Save is the reliable baseline; autosave is optional after completion.
- Shared users can read and update; only owners can share or delete.
- Imported source files are read in the browser and are not stored by the backend.
- TipTap JSON preserves rich-text structure across refresh and reopen.
- Real-time collaboration, production authentication, comments, version history, DOCX, and advanced permissions are deferred.

## Detailed Design

### Persistence Model

- `User` stores only a seeded user's name and unique email. It is deliberately separate from production authentication.
- `Document` stores a required title, structured TipTap JSON content, its owner, and creation/update timestamps.
- `DocumentShare` joins a document to a seeded user and enforces one share per document/user pair at the database level.
- Foreign-key cascades remove owned documents and related shares when their parent records are removed.
- Model ordering keeps users predictable, documents recently updated first, and shares chronological.

### API Identity and Access

- Protected document endpoints resolve a seeded application user from `X-User-Id` in one reusable identity component.
- Missing, malformed, and unknown identifiers return `401` with a stable error message.
- Document querysets include only records owned by or shared with the active simulated user, so inaccessible detail/update/delete operations resolve to `404`.
- Owners can read, update, and delete documents. Shared users can read and update but receive `403` for deletion.
- User listing is intentionally public so the frontend can populate the simulated-user switcher.
- Validation errors use a stable top-level `detail` and retain field-level information in `errors`.
- TipTap JSON validation checks the root document type, content list, and recursive node structure without introducing editor-schema duplication on the server.

### Authorization Verification

- Permanent DRF API tests create owner, shared, and unshared users in an isolated PostgreSQL test database.
- The primary authorization test proves the owner and shared user can retrieve the document, the shared user can persist an update, and an unshared user receives `404` for retrieval and update.
- A focused owner-only test proves a shared user receives `403` when deleting and that the document remains persisted.

### Frontend Workspace

- A small typed API client requires `VITE_API_BASE_URL`, composes it with relative REST paths, and attaches `X-User-Id` only to protected requests.
- React component state owns users, the active simulated user, owned/shared document summaries, selection, loading, and errors; no global state library is needed.
- The selected user ID is retained in local storage for reviewer convenience, but is accepted only when it still exists in the API-provided user list.
- Changing users immediately clears selection and stale lists, then fetches the new user's authorized document groups.
- The shell uses semantic sidebar, navigation, header, main, list, status, and alert structures with visible focus states.
- Local CORS explicitly permits `X-User-Id` and environment-controlled private-network access for the split development origins.

### Rich-Text Persistence

- TipTap uses StarterKit plus Underline, avoiding duplicate heading/list extension registration.
- Selecting a summary retrieves the latest complete document before mounting a keyed editor instance.
- Editor updates produce TipTap JSON and mark local state dirty; no network save occurs until the explicit Save action.
- Save PATCHes the title and structured content together, then updates both the editor state and matching sidebar summary from the server response.
- Save status is explicit and accessible: Unsaved changes, Saving, Saved, or Save failed with retained content and retry.
- Browser unload, document switching, user switching, and new-document creation guard unsaved changes.

Deployment configuration and further verification notes will be expanded as their implementation phases are completed.
