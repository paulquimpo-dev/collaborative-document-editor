# Collaborative Document Editor

## AI-Native Development Workflow

This log documents how AI is used during the assessment, which decisions remain human-owned, what suggestions are accepted or rejected, and how generated work is verified. It is updated while the project is being built rather than reconstructed after completion.

## Working Principles

- The candidate owns product scope, technical decisions, and final acceptance.
- AI accelerates analysis, planning, scaffolding, debugging, review, and documentation.
- AI output is inspected and verified before it is accepted.
- The master blueprint is the source of truth.
- A complete deployed core workflow takes priority over feature count.
- Optional features remain deferred until the required product and submission package are complete.
- Each development phase is implemented and verified as a gated unit.
- The candidate reviews the reported phase results, then owns the commit and push after confirming success.
- The AI coding agent does not commit or push unless explicitly instructed.
- Environment-specific API/service URLs, credentials, secrets, origins, and deployment values must never be hardcoded.

## Repository Workflow

For every implementation phase:

1. Implement only the approved phase scope.
2. Run the phase-specific automated and manual verification checks.
3. Update `AI_WORKFLOW.md`, `CHANGELOGS.md`, and affected project documentation.
4. Report changed files, verification results, known issues, and the next phase.
5. Stop and wait for candidate confirmation.
6. The candidate commits and pushes the confirmed phase to the initialized repository.

This keeps Git history aligned with verified delivery milestones and preserves clear human approval between phases.

## Workflow Log

### 2026-08-21 — Blueprint Review and Repository Inspection

#### AI assistance

- Read the complete `CDE_MASTER_BLUEPRINT.md` before proposing changes.
- Inspected the repository to establish that it contained the blueprint and a minimal README but no application implementation.
- Translated the blueprint into a proposed directory structure, minimal data model, REST API contract, frontend component structure, and ordered implementation plan.
- Identified likely time risks involving hosted SQLite persistence, CORS, TipTap extension duplication, autosave races, production seed data, Markdown conversion, and late deployment.

#### Human direction and decisions

- Required the blueprint to remain the source of truth.
- Required the submitted name to remain **Collaborative Document Editor**.
- Directed the work to prioritize a complete core product within the active assessment timer.
- Explicitly prohibited implementation code during the planning phase.
- Preserved the deliberate exclusions: real-time collaboration, production authentication, comments, version history, DOCX, advanced roles, and unnecessary architecture.

#### Result

- Planning was completed without generating application code.
- The plan focused on the required flow: create, edit, save, reopen, import, share, switch users, and open a shared document.

### 2026-08-21 — Blueprint Refinement

#### AI assistance

Proposed and applied focused blueprint clarifications:

- Made explicit Save the reliable baseline; autosave remains optional.
- Defined shared users as able to read and edit, while only owners can share or delete.
- Selected a small application-level seeded user model rather than production authentication machinery.
- Added a database uniqueness constraint for document shares.
- Moved the core authorization test ahead of frontend integration.
- Defined import as browser-read content sent to the backend as TipTap JSON, avoiding source-file storage and server-side TipTap conversion.
- Moved the first deployment checkpoint earlier so infrastructure failures surface before final polish.

#### Human direction and decisions

- Requested that the blueprint be updated before implementation.
- Requested separate technical-requirement and development-phase documents.
- Continued to withhold authorization to begin implementation.

#### Verification

- Applied the blueprint changes in small patches after an initial context mismatch caused the first combined patch to fail safely.
- Confirmed the failed patch made no changes before retrying.
- Ran a whitespace/error check after the successful edits.
- Confirmed the new files were present and that development phases referenced technical requirement identifiers.

### 2026-08-21 — Requirements and Phase Traceability

#### AI assistance

Created `TechnicalRequirements.md` with implementation-ready requirements for:

- Stack and dependency constraints
- Data models and database constraints
- Simulated identity and backend authorization
- REST endpoints and error responses
- Frontend editor, sharing, and import behavior
- Validation, testing, deployment, documentation, and explicit non-requirements

Created `DevelopmentPhases.md` with:

- An implementation order optimized for the timebox
- Requirement identifiers mapped to each phase
- A concrete exit check for every phase
- An early authorization-test phase
- An early deployment checkpoint
- A gate preventing optional work before the core submission is complete

#### Human direction and decisions

- Requested that development phases directly reflect the technical requirements.
- Requested continuous AI workflow documentation to demonstrate an AI-native working process.

#### Result

- Planning artifacts are now traceable from the blueprint to technical requirements and then to implementation phases.
- No application implementation has started.

## Current Status

- Blueprint reviewed and refined.
- Technical requirements documented.
- Development phases documented and mapped to requirements.
- Phase 0 project skeleton and guardrails completed.
- Phase 1 product implementation has not started.

## Implementation Workflow Log

### 2026-08-21 — Phase 0: Guardrails and Project Skeleton

#### AI assistance

- Inspected available Python, Node.js, and npm runtimes before scaffolding.
- Identified that the Windows `python` command and `py` launcher were unavailable or misconfigured, then used the bundled Python 3.12 runtime to create the project virtual environment.
- Scaffolded one Django project with one `documents` app and one Vite React/TypeScript application.
- Added only the dependencies justified by the blueprint: Django, Django REST Framework, CORS support, PostgreSQL/database URL support, Gunicorn, React, Vite, TypeScript, TipTap StarterKit, and TipTap Underline.
- Added environment-driven API URL, debug, secret key, allowed hosts, CORS origins, and database configuration.
- Added a backend health endpoint and a minimal branded frontend shell.
- Created initial README, architecture, and submission documentation.

#### Human direction and decisions

- Explicitly authorized Phase 0 after reviewing and approving the ordered phases.
- Retained the single-backend-app and local-state architecture to avoid unnecessary abstractions.
- Kept product features out of Phase 0 so the phase remained limited to a verified foundation.

#### Problems encountered and response

- Package downloads were initially blocked by the workspace network sandbox. Narrow approval was requested only for the declared pip and npm installation commands.
- The original README used UTF-16 encoding. It was converted to UTF-8 before applying the documentation update.
- A standalone Django test client call used the default `testserver` host, which was not in configured allowed hosts. The health check was rerun using configured `localhost`; production configuration was not weakened to accommodate the diagnostic.
- Vite's build process was blocked from resolving configuration by filesystem sandbox traversal. The same build was rerun with narrow approval and succeeded.
- The first Vite startup command forwarded a malformed argument and served a non-root base path. The server was restarted with the standard command and the root page was rechecked.

#### Verification

- `python manage.py check`: passed with no issues.
- Initial Django migrations: passed.
- Backend health endpoint: returned HTTP `200` with `{ "status": "ok" }`.
- Frontend ESLint check: passed.
- Frontend TypeScript and Vite production build: passed.
- npm audit: zero vulnerabilities reported at installation time.
- Django development server: started successfully.
- Vite development server: started successfully.
- Frontend root HTTP check: returned `200` and contained the project name.

#### Result

- Phase 0 exit checks passed.
- The repository now has a runnable backend and frontend foundation without optional product features.

## Verification Plan for Implementation

As implementation proceeds, this log will record the actual checks performed, including:

- Backend automated tests and their results
- Frontend build and type-check results
- Manual browser verification
- Save and refresh/reopen persistence checks
- Formatting persistence checks
- Import checks for both `.txt` and `.md`
- Owner, shared-user, and unauthorized-user access checks
- Deployment smoke-test results
- AI suggestions that were rejected or materially revised

## Design Workflow Log

### 2026-08-21 — UI/UX Design Direction

#### AI assistance

- Translated the candidate's visual direction into an implementation-oriented frontend guide.
- Defined a small set of CSS tokens, desktop layout guidance, component states, feedback behavior, accessibility requirements, responsive boundaries, and a UI completion threshold.
- Kept the guide compatible with the existing React and TipTap architecture without introducing a UI framework or custom design system.

#### Human direction and decisions

- Selected a calm, minimal productivity aesthetic with neutral slate/white surfaces and Indigo as the single primary accent.
- Prioritized functional completeness and implementation speed over elaborate visual polish.
- Required clear ownership, sharing, import, user-switching, persistence, empty, loading, and error states.
- Explicitly deferred branding, landing pages, gradients, glassmorphism, animation, dark mode, decorative graphics, complex mobile design, and excessive effects.

#### Result

- `UI_UX_DESIGN_GUIDE.md` is now the frontend design source of truth.
- The guide establishes a credible production-quality threshold and directs development back to core functionality once that threshold is met.

## Phase 1 Workflow Log

### 2026-08-21 — Persistence and Seeded Users

#### AI assistance

- Re-read the candidate-updated Phase 1 scope and suggested commit message before implementation.
- Implemented the minimal User, Document, and DocumentShare models from the technical requirements.
- Used a callable default for the empty TipTap document so records never share a mutable JSON object.
- Added explicit related names, deterministic model ordering, cascade behavior, and a database uniqueness constraint for document/user shares.
- Added lightweight Django admin registration for inspecting persisted data without creating product UI early.
- Added an idempotent management command that creates or updates Paul and Alex by unique email.
- Generated and inspected the initial Django migration.
- Added narrow persistence tests to validate Phase 1 requirements on a clean test database; authorization API tests remain reserved for Phase 3.

#### Human direction and decisions

- Confirmed Phase 0 manually and explicitly authorized Phase 1.
- Updated `DevelopmentPhases.md` with a phase-specific commit message.
- Retained ownership of Git commit and push after reviewing this phase's verification results.

#### Verification

- Applied `documents.0001_initial` successfully to the local database.
- Ran the seed command twice: the first run created Paul and Alex; the second updated the same records without duplication.
- Confirmed the local seeded-user count remained exactly two.
- Ran migrations against Django's clean in-memory test database.
- Passed three tests covering independent TipTap JSON defaults, database-level duplicate-share rejection, and seed-command idempotency.
- Confirmed `makemigrations --check --dry-run` reports no model changes.
- Confirmed Django system checks and Python dependency checks pass.

#### Result

- Phase 1 exit checks passed.
- The candidate manually repeated the Phase 1 verification process and confirmed that every expected output was shown.
- Manual confirmation covered migrations, idempotent seeding, document persistence, TipTap JSON content, share persistence, duplicate-share rejection, and the automated test suite.
- The candidate subsequently clarified that PostgreSQL is preferred for local development as well as deployment.
- Phase 1 therefore requires a PostgreSQL configuration and verification amendment before Phase 2 begins.
- Suggested candidate commit: `feat: add document persistence and seeded users`.

### 2026-08-21 — PostgreSQL Decision Alignment

#### AI assistance

- Inspected the local environment and confirmed PostgreSQL 18 and its Windows service are installed and running.
- Confirmed the server requires password authentication for the local `postgres` role.
- Identified that Django already supports `DATABASE_URL` and has the PostgreSQL driver installed, but does not yet load a local `.env` file.
- Updated the blueprint, technical requirements, development phases, setup documentation, architecture, submission notes, workflow log, and changelog to make PostgreSQL the primary local and deployed database.

#### Human direction and decisions

- Selected PostgreSQL over SQLite as the preferred database for both local development and deployment.
- Required the planning documents to reflect this decision before Phase 2.
- Retained SQLite only as an emergency, explicitly documented fallback.

#### Credential boundary

- Local PostgreSQL authentication requires credentials. The candidate will place the connection string in ignored `backend/.env` rather than exposing credentials in source control or chat.
- Credentials were supplied through the ignored file and were validated without printing them.

#### Environment-loading implementation

- Added `python-dotenv` as the single environment-file dependency.
- Django now loads only `backend/.env` before reading configuration.
- Updated `backend/.env.example` with the PostgreSQL `DATABASE_URL` shape and URL-encoding guidance.
- Clarified that `frontend/.env` is browser-visible and must never contain database credentials or Django secrets.
- Removed the silent SQLite default after PostgreSQL was connected. `DATABASE_URL` is now required; an emergency fallback must be selected explicitly.

#### PostgreSQL verification

- Created the local `collaborative_document_editor` PostgreSQL database.
- Applied all Django and documents migrations successfully.
- Ran `seed_users` twice and confirmed exactly two users remain.
- Confirmed Django reports the `postgresql` vendor and the intended database name.
- Created, retrieved, and removed a temporary document to prove TipTap JSON persistence on PostgreSQL.
- Created and destroyed a clean PostgreSQL test database through Django's test runner.
- Passed all three Phase 1 persistence tests against PostgreSQL.
- Confirmed no pending model migrations, Django system issues, or broken Python dependencies.

#### Result

- The PostgreSQL Phase 1 amendment is complete.
- Phase 1 is ready for final candidate confirmation before Phase 2.

### 2026-08-21 — Environment Configuration Guardrail

#### Human direction and decisions

- Required a project-wide rule prohibiting hardcoded APIs and environment-specific infrastructure values before deeper implementation begins.
- Required all such values to come from environment variables.

#### AI assistance

- Added repository-level `AGENTS.md` instructions so future implementation work is governed by the rule.
- Clarified that API origins/base URLs are environment-provided while relative endpoint paths remain code-level REST contract constants.
- Propagated the rule into the blueprint, technical requirements, development phases, README, architecture, and UI/UX guide.
- Required clear missing-configuration failures, secret isolation, tracked `.env.example` templates, and documentation updates whenever variables are added.

#### Result

- Future frontend API clients will require `VITE_API_BASE_URL` and compose it with relative paths.
- Backend URLs, hosts, origins, credentials, secrets, and database configuration remain environment-driven.
- Removed Django's hardcoded local defaults for secret key, debug mode, allowed hosts, CORS origins, and database URL; all are now required environment values.
- A source scan found no hardcoded HTTP origins, PostgreSQL URLs, localhost hosts, or loopback addresses in backend/frontend application source outside environment templates.
- Django checks and all three PostgreSQL tests passed after enforcing required configuration.

### 2026-08-21 — Phase 2: Backend CRUD and Authorization

#### AI assistance

- Re-read the candidate-updated Phase 2 scope, suggested commit message, and repository environment rules before implementation.
- Added reusable `X-User-Id` resolution with explicit `401` handling for missing, malformed, and unknown users.
- Implemented user, document-summary, and document-detail serializers.
- Added practical recursive TipTap JSON validation and trimmed-title validation.
- Implemented public seeded-user listing and protected document list/create/retrieve/update/delete endpoints.
- Implemented separate owned/shared list responses, accessible-queryset filtering, shared-user updates, owner-only deletion, and inaccessible-document `404` responses.
- Added a centralized DRF error handler with stable top-level messages.

#### Human direction and decisions

- Manually confirmed the PostgreSQL-backed Phase 1 behavior before authorizing Phase 2.
- Retained permanent authorization API tests as the explicitly separate Phase 3 deliverable.
- Continued to reserve Git commit and push ownership for the candidate after manual confirmation.

#### Verification and iteration

- Django checks and URL reversing confirmed all Phase 2 routes were registered.
- The first transactional API check exposed DRF's built-in blank-title validation running before the intended clearer message.
- Adjusted the serializer field so explicit trimming and blank-title validation controls the response; the failed verification transaction rolled back without leaving data.
- Reran the complete API matrix successfully inside a rolled-back PostgreSQL transaction.
- Verified public user listing; missing/invalid identity `401`; create/list/retrieve/update/delete; owned/shared grouping; TipTap JSON persistence; title/content validation; shared read/update; shared delete `403`; unshared `404`; and owner deletion.
- Confirmed the existing three PostgreSQL tests, Django checks, migration consistency, and Python dependency checks still pass.
- Confirmed backend application source contains no hardcoded service origins, PostgreSQL URLs, localhost hosts, or loopback addresses.

#### Result

- Phase 2 exit checks pass programmatically.
- The candidate manually tested the Phase 2 API flow and confirmed the expected identity, validation, CRUD, ownership, sharing-access, and unauthorized-access behavior.
- Phase 2 is manually confirmed and approved for commit and push.
- Suggested candidate commit: `feat: implement document API and access control`.
