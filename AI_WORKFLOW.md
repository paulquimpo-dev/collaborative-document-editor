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
- Persistence and seeded identity foundations are ready for Phase 2 API implementation.
- Suggested candidate commit: `feat: add document persistence and seeded users`.
