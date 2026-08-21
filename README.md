# Collaborative Document Editor

Full Stack Product Engineer Technical Assessment

## Overview

A lightweight collaborative document editing application demonstrating rich-text editing, persistence, text and Markdown import, document ownership, and user-to-user sharing.

## Current Status

Phase 2 document CRUD and backend authorization are implemented and verified against PostgreSQL. The permanent authorization API test is next in the ordered phases defined in `DevelopmentPhases.md`.

## Planned Core Features

- Create, rename, edit, save, and reopen rich-text documents
- Bold, italic, underline, heading, bulleted-list, and numbered-list formatting
- Import editable `.txt` and `.md` documents
- Seeded users and simulated identity switching
- Separate My Documents and Shared With Me views
- Owner-controlled sharing with backend-enforced access

## Stack

- React, TypeScript, Vite, and TipTap
- Django and Django REST Framework
- PostgreSQL for local development and deployment
- SQLite only as a documented emergency fallback

## Local Setup

Detailed setup and demonstration instructions will be completed as implementation and deployment progress.

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
```

The document list returns separate `owned` and `shared` arrays. Owners can read, update, and delete; shared users can read and update; other users receive `404` for inaccessible documents. Sharing and import endpoints are implemented in their later phases.

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`

## Scope

This assessment deliberately excludes production authentication, real-time collaboration, comments, version history, DOCX parsing, advanced roles, and unnecessary infrastructure. See `CDE_MASTER_BLUEPRINT.md` and `TechnicalRequirements.md` for the full scope.

## Environment Configuration Rule

Application code must not hardcode API base URLs, service origins, database URLs, credentials, secrets, or deployment hosts. Django reads server configuration from `backend/.env` locally. Vite reads browser-safe configuration from `frontend/.env`. Deployment platforms provide the same variables through their environment settings.

Frontend requests use `VITE_API_BASE_URL` plus relative API paths. Never place secrets in `VITE_*` variables. When configuration changes, update the matching `.env.example` and this README.
