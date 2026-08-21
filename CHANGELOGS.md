# Collaborative Document Editor

## Project Changelog

This file tracks meaningful project changes made during the assessment. Entries describe what changed in the project; AI usage and decision-making context are documented separately in `AI_WORKFLOW.md`.

## 2026-08-21

### Added

- Added owner-only document sharing API/UI with eligible-user selection and duplicate/self/non-owner validation.
- Added persisted `.txt` and `.md` import with browser file reading, editable TipTap conversion, backend extension validation, and immediate opening.
- Added owner-only frontend document deletion with a confirmation modal and immediate list/editor cleanup, completing frontend CRUD.
- Added backend tests for successful sharing, duplicate/self/non-owner rejection, supported import, and unsupported extensions.
- Added an accessible custom unsaved-changes modal with Keep editing and Discard changes actions.
- Added document detail, create, and update functions to the typed frontend API layer.
- Added New Document creation with immediate editor opening and owned-list insertion.
- Added the TipTap rich-text editor with bold, italic, underline, Heading 1/2, bullet-list, and numbered-list controls.
- Added editable titles and structured TipTap JSON persistence through explicit Save.
- Added Unsaved changes, Saving, Saved, Save failed, and inline error feedback.
- Added unsaved-change guards for document/user switching, new document creation, and browser unload.
- Added the environment-configured typed frontend API client and document/user request functions.
- Added the desktop application shell, compact sidebar, user switcher, owned/shared document lists, selection state, and workspace state cards.
- Added loading, empty, API-error, ownership, document-count, and active-selection feedback.
- Added explicit backend CORS support for `X-User-Id` and environment-controlled private-network development requests.
- Added semantic landmarks, labels, focus states, reduced-motion handling, and desktop-width tolerance.
- Added a permanent PostgreSQL-backed authorization API test covering owner access, shared-user access and updates, and unshared-user isolation.
- Added permanent coverage proving shared users cannot delete owner documents.
- Added reusable simulated-user resolution through `X-User-Id` with stable `401` errors.
- Added serializers for seeded users, document summaries, and document details.
- Added recursive practical validation for TipTap JSON and trimmed document titles.
- Added `GET /api/users/` and document list/create/retrieve/update/delete endpoints.
- Added separate owned/shared document list responses.
- Added backend-enforced owner/shared access filtering and owner-only deletion.
- Added centralized API error normalization with `detail` and retained field errors.
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

- Added Render Blueprint configuration for the Django API and managed PostgreSQL deployment.
- Added WhiteNoise production static-file handling and documented the Render/Vercel deployment and smoke-test workflow.
- Documented that deployment-generated hosts, origins, database credentials, and secrets remain environment-provided rather than hardcoded.
- Deployed and verified the production application on Vercel with the Django API and managed PostgreSQL hosted on Render.
- Replaced in-app native discard confirmations with a controlled modal and fixed the user switcher becoming visually stuck after cancel/discard.
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

- Passed seven PostgreSQL backend tests plus Django checks and migration consistency after Phases 7–9.
- Passed frontend ESLint, TypeScript compilation, and the Vite production build after sharing, import, and delete integration.
- Confirmed Keep editing preserves the active user and unsaved content, and Discard changes completes the requested user switch.
- Confirmed the user switcher remains reusable after either modal action and no discarded title reaches PostgreSQL.
- Candidate manually confirmed the complete Phase 5 editor and corrected unsaved-change workflow.
- Verified create, rename, rich-text formatting, save, browser refresh, reopen, and formatting persistence end to end.
- Confirmed persisted TipTap markup contains headings, strong marks, paragraphs, and bullet-list structure after reopen.
- Confirmed the unsaved-change navigation guard displays a native discard confirmation.
- Removed the Phase 5 browser verification document after testing.
- Passed frontend ESLint and the TypeScript/Vite production build.
- Visually verified the Phase 4 layout and interaction states in the local browser.
- Confirmed switching Alex to Paul refreshes owned/shared lists and clears selection without a page reload.
- Confirmed local browser CORS preflight permits private-network access and `X-User-Id`.
- Confirmed temporary Phase 4 visual fixtures were removed after testing.
- Candidate approved the verified Phase 4 workspace for commit and push.
- Passed five backend tests on a clean PostgreSQL test database, including the two new authorization API tests.
- Confirmed the shared-user update persists, unshared retrieval/update returns `404`, and shared deletion returns `403` without deleting the document.
- Passed the complete Phase 2 API behavior matrix in a rolled-back PostgreSQL transaction.
- Confirmed owners can perform CRUD, shared users can read/update but not delete, and unshared users receive `404`.
- Confirmed missing and invalid simulated identities return `401`.
- Confirmed blank titles and malformed TipTap JSON return understandable `400` responses.
- Confirmed all Phase 2 routes resolve and no model migration changes are pending.
- Candidate manually confirmed the Phase 2 API behavior and approved the phase for commit and push.
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
