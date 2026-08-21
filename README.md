# Collaborative Document Editor

Full Stack Product Engineer Technical Assessment

## Overview

A lightweight collaborative document editing application demonstrating rich-text editing, persistence, text and Markdown import, document ownership, and user-to-user sharing.

## Current Status

The core assessment product is complete and deployed: rich-text CRUD, persistence, `.txt`/`.md` import, simulated-user switching, owner-controlled sharing, shared editing, and backend-enforced authorization.

## Core Features

- Create, rename, edit, save, and reopen rich-text documents
- Bold, italic, underline, heading, bulleted-list, and numbered-list formatting
- Import editable `.txt` and `.md` documents
- Seeded users and simulated identity switching
- Separate My Documents and Shared With Me views
- Owner-controlled sharing with backend-enforced access

## Editor Workflow

Select **New Document** to create and open an untitled document. Rename it, add formatted content, and use the explicit **Save** action. The UI distinguishes Unsaved changes, Saving, Saved, and Save failed states. Refresh the browser and reopen the document from My Documents to verify persisted title, content, headings, emphasis, and lists.

The editor currently supports bold, italic, underline, Heading 1, Heading 2, bullet lists, and numbered lists. Navigation warns before discarding unsaved changes.

Owners can share an open document with another seeded user through the Share dialog. The recipient finds it under **Shared With Me** and can edit/save it, but cannot share or delete it. Owners can permanently delete documents through a confirmation dialog.

**Import File** accepts `.txt` and `.md`, uses the filename as the document title, and immediately opens the persisted editable document. To protect the timebox, both formats are converted into editable paragraphs; Markdown syntax remains plain editable text rather than adding a custom parser.

## Stack

- React, TypeScript, Vite, and TipTap
- Django and Django REST Framework
- PostgreSQL for local development and deployment
- SQLite only as a documented emergency fallback

## Local Setup

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
# Set DATABASE_URL in .env with local PostgreSQL credentials.
# Create collaborative_document_editor in PostgreSQL once if it does not exist.
python manage.py migrate
python manage.py seed_users
python manage.py runserver
```

Health check: `http://localhost:8000/api/health/`

The local `.env` file is ignored by Git and must never be committed. The expected database URL shape is:

```text
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/collaborative_document_editor
```

Percent-encode PostgreSQL passwords containing URL-reserved characters such as `@`, `:`, `/`, `?`, or `#`. Django loads `backend/.env` automatically; frontend variables remain isolated in `frontend/.env` and must never contain server secrets.

`DATABASE_URL` is required. Django will fail with a clear configuration error rather than silently selecting a different database. An emergency SQLite fallback remains possible only by explicitly setting a SQLite `DATABASE_URL` and documenting the decision.

Local cross-port browser development also requires:

```text
CORS_ALLOWED_ORIGINS=http://localhost:5173
CORS_ALLOW_PRIVATE_NETWORK=true
```

The backend explicitly permits the simulated `X-User-Id` request header. Hosted environments should set private-network access according to their network topology rather than copying the local value blindly.

Seeded users:

- Paul — `paul@example.com`
- Alex — `alex@example.com`

## API Identity

Protected document requests require the seeded user's database ID:

```http
X-User-Id: 1
```

Retrieve available seeded users from `GET /api/users/`. The user list is intentionally public for the simulated-user prototype.

## Implemented API

```text
GET    /api/users/
GET    /api/documents/
POST   /api/documents/
GET    /api/documents/:id/
PATCH  /api/documents/:id/
DELETE /api/documents/:id/
POST   /api/documents/import/
POST   /api/documents/:id/share/
```

The document list returns separate `owned` and `shared` arrays. Owners can read, update, delete, and share; shared users can read and update; other users receive `404` for inaccessible documents. Import accepts browser-generated TipTap JSON plus a `.txt` or `.md` filename. Share rejects invalid users, self-sharing, duplicates, and non-owner attempts.

## Tests

Run the PostgreSQL-backed backend suite from `backend/`:

```powershell
python manage.py test
```

The seven-test suite covers persistence defaults, unique shares, idempotent seeding, owner/shared/unshared API access, shared-user updates, owner-only deletion/sharing, duplicate/self-sharing validation, and supported/unsupported imports. Django creates and destroys an isolated PostgreSQL test database automatically.

### Frontend

```powershell
cd frontend
npm install
Copy-Item .env.example .env
# Set VITE_API_BASE_URL=http://127.0.0.1:8000/api
npm run dev
```

Frontend: `http://localhost:5173`

## Scope

This assessment deliberately excludes production authentication, real-time collaboration, comments, version history, DOCX parsing, advanced roles, and unnecessary infrastructure. See `CDE_MASTER_BLUEPRINT.md` and `TechnicalRequirements.md` for the full scope.

## Environment Configuration Rule

Application code must not hardcode API base URLs, service origins, database URLs, credentials, secrets, or deployment hosts. Django reads server configuration from `backend/.env` locally. Vite reads browser-safe configuration from `frontend/.env`. Deployment platforms provide the same variables through their environment settings.

Frontend requests use `VITE_API_BASE_URL` plus relative API paths. Never place secrets in `VITE_*` variables. When configuration changes, update the matching `.env.example` and this README.

## Production Deployment

### 1. Backend and PostgreSQL on Render

1. Push the repository with `render.yaml` to GitHub.
2. In Render, create a **Blueprint** from this repository and apply it.
3. When prompted for `DJANGO_ALLOWED_HOSTS`, enter only the generated backend hostname, without a scheme or path (for example, `your-service.onrender.com`).
4. For the initial `CORS_ALLOWED_ORIGINS` value, enter the intended Vercel production origin including `https://`. Correct it after Vercel assigns the final URL if necessary.
5. Confirm the build completes. The build installs dependencies, collects static files, migrates the managed PostgreSQL database, and idempotently seeds Paul and Alex.
6. Open `https://<backend-host>/api/health/` and confirm the JSON health response.

Never copy the production database URL or secret into a repository file. Render injects `DATABASE_URL` from the managed database and generates `DJANGO_SECRET_KEY`.

### 2. Frontend on Vercel

1. Import the same GitHub repository into Vercel.
2. Set **Root Directory** to `frontend`; Vercel should detect Vite and use `npm run build` with output directory `dist`.
3. Add `VITE_API_BASE_URL=https://<backend-host>/api` to the Production environment. This is browser-visible and must not contain secrets.
4. Deploy and copy the final `https://<project>.vercel.app` origin.
5. In Render, set `CORS_ALLOWED_ORIGINS` to that exact origin and redeploy the backend if the initial value differed.

### 3. Production Smoke Test

- Open the Vercel URL and confirm Paul and Alex load in the user switcher.
- As Paul, create a document, rename it, add rich text and formatting, then save.
- Refresh, reopen the document from **My Documents**, and confirm the title, content, and formatting persisted.
- Switch users and confirm the request succeeds across origins; at this phase Alex is expected not to see Paul's unshared document.
- In browser developer tools, confirm protected API requests target the Render `/api` URL and include `X-User-Id` without a CORS error.

Record the final frontend and backend URLs in `SUBMISSION.md` only after this smoke test passes. Free services can cold-start; document that limitation rather than adding infrastructure.

Verified production services:

- Frontend: `https://collab-doc-qmpo.vercel.app`
- API health: `https://collaborative-document-editor-api.onrender.com/api/health/`

## Reviewer Demo Flow

1. Open the live frontend and select Paul.
2. Create, rename, format, and explicitly save a document; refresh and reopen it.
3. Import a `.txt` or `.md` file and confirm the imported document is editable.
4. Share the document with Alex.
5. Switch to Alex, find it under **Shared With Me**, open it, edit it, and save.
6. Confirm Alex has no Share/Delete controls; switch to Paul to demonstrate owner deletion.

The timed recording outline is in `WALKTHROUGH.md`.

## Known Limitations

- Identity is deliberately simulated through seeded users and `X-User-Id`; this is not production authentication.
- Collaboration is shared persistence, not real-time simultaneous editing.
- Markdown uses the blueprint-approved editable plain-text fallback instead of rendered Markdown conversion.
- Save is explicit; autosave, conflict resolution, comments, and version history are outside scope.
- The UI is desktop-first and the TipTap bundle produces a non-blocking size warning.
- Free hosting can cold-start after inactivity, so the first API request may be slower.
