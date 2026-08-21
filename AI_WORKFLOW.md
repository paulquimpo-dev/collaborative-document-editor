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

### 2026-08-21 — Phase 3: Authorization Test

#### AI assistance

- Re-read the Phase 3 scope and candidate-provided commit message before implementation.
- Added a permanent DRF API test fixture with an owner, shared user, unshared user, document, and share relationship.
- Added the highest-value test proving owner access, shared-user access and persisted updates, and `404` isolation for an unshared user.
- Added focused coverage proving a shared user receives `403` for deletion and the document remains persisted.
- Kept share creation at the model layer because the owner-facing sharing endpoint is deliberately scheduled for Phase 7.

#### Human direction and decisions

- Manually confirmed Phase 2 and authorized Phase 3 after committing and pushing the verified API implementation.
- Preserved the narrow testing scope instead of expanding into a large suite that could threaten delivery time.

#### Verification

- Django created and migrated a clean `test_collaborative_document_editor` PostgreSQL database.
- All two new authorization API tests and three existing persistence tests passed.
- Django destroyed the isolated PostgreSQL test database after the run.
- Django system checks, migration consistency, Python dependency checks, repository whitespace checks, and the hardcoded-configuration scan passed.

#### Result

- Phase 3 exit checks pass.
- Phase 3 awaits candidate confirmation.
- Suggested candidate commit: `test: add document sharing authorization coverage`.

### 2026-08-21 — Phase 4: Frontend Shell and User Switching

#### AI assistance

- Re-read the Phase 4 requirements, UI/UX guide, environment rules, and suggested commit message before implementation.
- Added a typed API client that requires `VITE_API_BASE_URL`, composes relative paths, attaches `X-User-Id`, and surfaces readable backend/network errors.
- Built the semantic desktop application shell, compact sidebar, owned/shared document groups, selectable rows, active-user switcher, empty/loading/error states, and document-selection surface.
- Used local component state and retained only the validated active-user ID in local storage; no global state dependency was introduced.
- Applied the guide's slate/white surfaces, single Indigo accent, 8px-based spacing, subtle borders/shadows, focus states, ownership labels, and desktop tolerance.

#### Problems encountered and response

- The first combined patch was rejected because it targeted the stylesheet twice; no files changed, and the edits were reapplied in separate patches.
- Browser integration initially failed because stale Vite and Django development processes were still serving pre-environment and pre-CORS configuration. Exact listener processes were identified and only those local development processes were restarted.
- Browser preflight exposed missing permission for `X-User-Id` and modern local private-network access. Added the custom header explicitly and made private-network CORS behavior environment-controlled.
- Aligned the local frontend API URL with Django's IPv4 bind address through `frontend/.env`; no URL was added to application source.

#### Verification

- Frontend ESLint and the TypeScript/Vite production build passed.
- All five PostgreSQL backend tests and Django system checks passed.
- Browser DOM inspection confirmed semantic headings, labels, navigation, buttons, counts, ownership details, empty states, and selection states.
- Visual inspection confirmed the intended clean desktop productivity layout and sufficient contrast.
- Switched Alex to Paul without a page reload and confirmed selection cleared while owned/shared counts and lists refreshed correctly.
- Confirmed the browser successfully completed CORS preflight and API requests using `X-User-Id`.
- Removed all temporary visual-test documents and their share after verification.

#### Result

- Phase 4 exit checks pass.
- The candidate approved Phase 4 for commit and push.
- At approval, the assessment timer showed 130 minutes 30 seconds remaining; remaining work was reallocated toward editor persistence, deployment, sharing, import, quality, and submission buffer.
- Suggested candidate commit: `feat: add document workspace and user switching`.

### 2026-08-21 — Phase 5: Editor and Persistence

#### AI assistance

- Re-read the Phase 5 scope and suggested commit message before implementation.
- Extended the typed API layer for document detail, creation, and PATCH updates without hardcoded service origins.
- Added a TipTap editor using StarterKit and Underline with bold, italic, underline, Heading 1/2, bullet-list, and numbered-list controls.
- Added editable title, ownership context, explicit Save, dirty/saving/saved/error feedback, and inline save failures.
- Enabled New Document to create, add to the owned list, and open immediately.
- Added guards for dirty document switching, user switching, new-document creation, and browser unload.

#### Verification and iteration

- Frontend ESLint and TypeScript/Vite production build passed; the build reported a non-blocking bundle-size warning from the editor dependency, and code splitting was deliberately deferred to protect the timebox.
- All five PostgreSQL backend tests and Django checks passed.
- Browser testing created and opened a new document, renamed it, added a heading, bold content, and a bullet list, and showed Unsaved changes.
- Save persisted the title and TipTap JSON through PATCH and updated the sidebar title.
- After browser refresh and reopen, the heading, strong marks, paragraphs, and list structure were present in the rendered editor DOM.
- The dirty-navigation test opened the expected native discard confirmation; browser automation timed out while the blocking modal was active, but the unsaved title was never transmitted.
- Removed the single Phase 5 verification document after testing.

#### Result

- Phase 5 exit checks pass.
- Phase 5 awaits candidate manual confirmation.
- Suggested candidate commit: `feat: add rich-text editing and document persistence`.

#### Manual-test defect and correction

- Candidate testing found that the native unsaved-changes confirmation left the controlled user select visually stuck after either OK or Cancel and judged the browser-native prompt to be poor in-app UX.
- Root cause: the native select changed its DOM value before React rejected the state transition; with application state unchanged, selecting the same visible option again did not emit another change.
- Replaced in-app native confirmation with an accessible application modal offering Keep editing and Discard changes.
- The user select now immediately restores the active value while navigation approval is pending.
- Added safe default focus, Escape/backdrop cancellation, explicit warning copy, and destructive-action styling. Browser refresh/close retains the required native unload warning.
- Browser verification confirmed Keep editing preserves Paul and unsaved content, while a second switch followed by Discard changes successfully changes to Alex.
- No unsaved verification edit was transmitted to PostgreSQL.
- The candidate repeated the Phase 5 manual test after the correction and confirmed the complete phase, including the revised unsaved-change workflow.
- The candidate stopped both manually started development servers before authorizing commit and push.

### 2026-08-21 — Phase 6: First Deployment Checkpoint

#### AI assistance

- Re-read the deployment phase, environment rules, architecture notes, and submission requirements before changing production configuration.
- Checked current official Render Django/PostgreSQL and Vercel Vite/monorepo deployment guidance to avoid relying on stale platform settings.
- Added a minimal Render Blueprint for the Django service and managed PostgreSQL database, including dependency installation, static collection, migrations, seeded users, Gunicorn startup, and health checking.
- Added WhiteNoise solely for reliable Django static-file serving in production.
- Kept generated service hosts, frontend origins, database credentials, and secrets outside source control; the hosting dashboards provide every environment-specific value.
- Documented the exact Render/Vercel deployment sequence and live create/edit/save/refresh/reopen smoke test.

#### Human direction and decisions

- Explicitly authorized proceeding to the next phase after confirming Phase 5.
- Retained PostgreSQL as the required production database and the Render/Vercel split proposed by the blueprint.
- Must connect the GitHub repository to the candidate-owned hosting accounts and confirm the final generated service URLs.

#### Result

- Production configuration is ready for verification.
- Phase 6 remains in progress until both live services are deployed and the production smoke test passes.

#### Production verification

- The candidate connected the GitHub repository to Render and Vercel using the documented configuration.
- Render provisioned the Django web service and managed PostgreSQL database; the live health endpoint returned `{"status": "ok"}`.
- Vercel deployed the Vite frontend from `frontend/` with the Render API base URL supplied through `VITE_API_BASE_URL`.
- The generated Vercel production domain differed from the provisional origin, so `CORS_ALLOWED_ORIGINS` was corrected to the exact stable production origin and Render redeployed.
- The candidate manually confirmed seeded users load and create, rich-text edit, save, refresh, reopen, formatting persistence, and user switching all work in production.
- Phase 6 exit checks pass with 77 minutes 58 seconds remaining at confirmation.

### 2026-08-21 — Phases 7–9: Sharing, Import, and Integrated Quality

#### AI assistance

- Implemented owner-only sharing through the existing document viewset and added stable validation for missing users, self-sharing, duplicate sharing, and non-owner attempts.
- Added an owner-only Share dialog populated from seeded users who do not already have access.
- Implemented `.txt` and `.md` browser reading, filename-derived titles, editable TipTap paragraph conversion, backend extension validation, persisted creation, and immediate opening.
- Used the blueprint-approved editable plain-text Markdown fallback instead of adding a parser dependency under the timebox.
- Completed frontend CRUD with an owner-only Delete action, accessible confirmation dialog, backend request, and immediate state reconciliation.
- Added targeted API coverage for sharing validation and import behavior while retaining the existing access/update/delete authorization tests.

#### Verification

- All seven backend tests pass on a clean PostgreSQL test database.
- Django system checks and migration consistency checks pass with no model changes required.
- Frontend ESLint, TypeScript compilation, and the Vite production build pass.
- The existing non-blocking TipTap bundle-size warning remains accepted; optional code splitting is deferred.
- Manual confirmation is required before commit/push and production redeployment.
