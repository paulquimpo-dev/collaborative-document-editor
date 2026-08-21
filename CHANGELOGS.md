# Collaborative Document Editor

## Project Changelog

This file tracks meaningful project changes made during the assessment. Entries describe what changed in the project; AI usage and decision-making context are documented separately in `AI_WORKFLOW.md`.

## 2026-08-21

### Added

- Added repository-level `AGENTS.md` rules prohibiting hardcoded environment-specific API/service URLs, credentials, secrets, origins, and deployment values.
- Added requirements for environment-provided API base URLs, relative endpoint composition, clear missing-configuration failures, and synchronized `.env.example` documentation.
- Added `python-dotenv` and backend-local `.env` loading for Django configuration.
- Added a PostgreSQL `DATABASE_URL` template with an explicit URL-encoded password placeholder.
- Added a frontend environment warning that browser-visible configuration must not contain backend secrets.
- Added the Phase 1 User, Document, and DocumentShare persistence models.
- Added structured TipTap JSON as the callable default for new document content.
- Added document ownership relationships and document-share relationships with cascade cleanup.
- Added the database-level `unique_document_share_user` constraint.
- Added Django admin registration for seeded users, documents, and shares.
- Added the idempotent `seed_users` management command for Paul and Alex.
- Added and applied the initial `documents` migration.
- Added three persistence tests covering TipTap JSON default isolation, unique shares, and repeatable seeding.
- Added `UI_UX_DESIGN_GUIDE.md` as the implementation source of truth for frontend layout, visual tokens, component behavior, feedback states, accessibility, responsive boundaries, and the UI completion threshold.
- Added the Phase 0 Django backend scaffold with one `documents` app.
- Added Django REST Framework and environment-driven database, host, CORS, debug, and secret-key configuration.
- Added `GET /api/health/` for deployment and startup verification.
- Added the Phase 0 Vite, React, and TypeScript frontend scaffold.
- Added the required TipTap StarterKit and Underline dependencies without implementing editor functionality early.
- Added backend and frontend `.env.example` files.
- Added `.gitignore` rules for virtual environments, dependencies, builds, local databases, and environment secrets.
- Added `ARCHITECTURE.md` and `SUBMISSION.md` skeletons.
- Added local backend and frontend setup instructions to `README.md`.
- Added `TechnicalRequirements.md` with implementation-ready requirements for the stack, data model, API, authorization, frontend behavior, validation, testing, deployment, and explicit non-requirements.
- Added `DevelopmentPhases.md` with ordered implementation phases, requirement mappings, phase exit checks, an early deployment checkpoint, and an optional-work gate.
- Added `AI_WORKFLOW.md` to document AI assistance, human-owned decisions, verification, and project status throughout the assessment.
- Established a permission matrix:
  - Owners can read, update, delete, and share their documents.
  - Shared users can read and update shared documents.
  - Other users have no access.
- Defined a unique database constraint for each document/user share pair.
- Defined browser-read `.txt` and `.md` import using TipTap JSON without storing source files.

### Changed

- Removed hardcoded Django configuration defaults; secret key, debug mode, allowed hosts, CORS origins, and database URL are now required environment values.
- Made `DATABASE_URL` mandatory so Django cannot silently fall back to SQLite when PostgreSQL configuration is missing.
- Changed the persistence decision from SQLite-first local development to PostgreSQL for both local development and deployment.
- Reclassified SQLite as an emergency fallback that must be explicitly documented if used.
- Updated Phase 1 to require ignored `.env` loading, a local PostgreSQL connection, and PostgreSQL-backed migration/seeding verification before Phase 2.
- Updated setup, architecture, submission, and workflow documentation to reflect the PostgreSQL decision.
- Updated `CDE_MASTER_BLUEPRINT.md` to make explicit Save the required baseline and leave autosave optional.
- Clarified that the project uses small application-level seeded users rather than production authentication.
- Clarified owner and shared-user permissions.
- Moved the meaningful backend authorization test ahead of frontend integration.
- Moved the first deployment checkpoint earlier so infrastructure issues can be found before final polish.
- Clarified server-side validation for imported file extensions, duplicate shares, and self-sharing.

### Decisions Preserved

- The submitted project remains named **Collaborative Document Editor**.
- The blueprint remains the product source of truth.
- Implementation has not started during the planning phase.
- Real-time collaboration, production authentication, comments, version history, DOCX support, advanced roles, global state libraries, microservices, and other stretch features remain deferred.

### Verification

- Confirmed application source contains no hardcoded HTTP origins, PostgreSQL URLs, localhost hosts, or loopback addresses outside environment templates.
- Confirmed Django checks and all three PostgreSQL tests pass with required environment-only configuration.
- Confirmed Django connects to the local `collaborative_document_editor` PostgreSQL database.
- Applied all migrations and repeated seeded-user creation successfully on PostgreSQL.
- Confirmed TipTap JSON document persistence on PostgreSQL.
- Confirmed Django can create, migrate, test, and destroy a clean PostgreSQL test database.
- Passed all three Phase 1 tests using PostgreSQL.
- Confirmed a clean Django test database can apply all migrations.
- Confirmed running `seed_users` repeatedly leaves exactly two seeded users.
- Confirmed empty TipTap JSON content can be stored without sharing mutable defaults between documents.
- Confirmed duplicate document/user shares raise a database integrity error.
- Confirmed all three Phase 1 tests pass.
- Confirmed the migration state matches the model state with no pending changes.
- Candidate manually confirmed all Phase 1 checks and observed every expected result.
- Installed backend and frontend dependencies successfully.
- Confirmed Django system checks and initial migrations pass.
- Confirmed the backend and frontend development servers start successfully.
- Confirmed the backend health endpoint and frontend root return HTTP `200`.
- Confirmed frontend lint and production build pass.
- Confirmed npm reported zero dependency vulnerabilities at installation time.
- Confirmed the planning documents are present.
- Confirmed development phases reference requirement identifiers from `TechnicalRequirements.md`.
- Ran a repository diff whitespace/error check after documentation changes.
