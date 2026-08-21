# Collaborative Document Editor

## Development Phases

This implementation plan is ordered to deliver the smallest complete product quickly. Requirement identifiers refer to `TechnicalRequirements.md`. A phase is complete only when its exit check passes. Optional work must not begin until all required phases are complete.

## Git Commit Convention

Use Conventional Commits throughout the project.

Primary commit types:

- `feat:` — new user-facing functionality
- `fix:` — bug fixes
- `test:` — automated tests
- `docs:` — documentation
- `refactor:` — code restructuring without behavior changes
- `chore:` — setup, dependencies, configuration, tooling
- `style:` — UI/CSS changes that do not change application behavior

Commit only after the phase exit check passes. If a phase contains substantial independent work, additional commits are allowed, but avoid unnecessary micro-commits.

---

## Phase 0 — Guardrails and Project Skeleton

### Implements

- Stack and scope constraints
- TR-UI-01 foundation
- Deployment and documentation foundations

### Work

1. Create `backend/` with Django, Django REST Framework, and one `documents` app.
2. Create `frontend/` with Vite, React, and TypeScript.
3. Add the required TipTap packages and only essential dependencies.
4. Add environment-based backend API URL, Django debug, allowed-host, CORS, and database settings.
5. Establish the repository rule prohibiting hardcoded environment-specific API/service URLs and secrets.
6. Create skeletons for `README.md`, `ARCHITECTURE.md`, `AI_WORKFLOW.md`, and `SUBMISSION.md`.
7. Confirm both development servers start before adding product code.

### Exit check

- Frontend and backend run locally.
- No optional architecture or feature has been introduced.
- Environment-specific configuration is supplied through environment variables rather than hardcoded application values.

### Commit

`chore: initialize full-stack project structure`

---

## Phase 1 — Persistence and Seeded Users

### Implements

- TR-DATA-01
- TR-DATA-02
- TR-DATA-03
- TR-AUTH-01 identity foundation

### Work

1. Implement User, Document, and DocumentShare models.
2. Add the `(document, user)` unique constraint.
3. Create and run migrations.
4. Add an idempotent seed command for Paul and Alex.
5. Confirm TipTap's empty JSON document can be stored and retrieved.
6. Load local configuration from an ignored `backend/.env` file.
7. Connect local development to PostgreSQL through `DATABASE_URL`.
8. Run migrations, seeding, and persistence verification against PostgreSQL.

### Exit check

- A clean database can migrate and seed successfully.
- Re-running the seed command does not duplicate users.
- The local application reports PostgreSQL as its active database engine.

### Commit

`feat: add document persistence and seeded users`

---

## Phase 2 — Backend CRUD and Authorization

### Implements

- TR-AUTH-01
- TR-AUTH-02
- TR-API-01 through TR-API-06
- TR-API-09
- Core validation requirements

### Work

1. Resolve the current seeded user from `X-User-Id` in one reusable location.
2. Implement serializers for users, document summaries, and document details.
3. Implement user listing.
4. Implement owned/shared document listing.
5. Implement document create, retrieve, update, and delete.
6. Filter retrieval so inaccessible documents return `404`.
7. Enforce owner/shared update rules and owner-only deletion.
8. Validate titles and practical TipTap JSON structure.
9. Return stable, understandable error responses.

### Exit check

- API calls can create, retrieve, update, list, and delete documents.
- An owner has full access, a shared user has read/update access, and another user has no access.

### Commit

`feat: implement document API and access control`

---

## Phase 3 — Authorization Test

### Implements

- Minimum automated testing requirement

### Work

1. Add the highest-value API test: a shared user can access a document while an unshared user cannot.
2. Include ownership, share creation, identity headers, and response assertions in the test.
3. Add non-owner share/delete tests only if they take little additional time.

### Exit check

- The meaningful authorization test passes from a clean test database.

### Commit

`test: add document sharing authorization coverage`

---

## Phase 4 — Frontend Shell and User Switching

### Implements

- TR-UI-01
- TR-AUTH-01 frontend behavior
- TR-API-01 and TR-API-02 integration

### Work

1. Create the API client and attach the selected `X-User-Id` automatically.
2. Build the application layout and user switcher.
3. Load seeded users from the backend.
4. Display separate My Documents and Shared With Me lists.
5. Add New Document and Import File actions.
6. Add loading, empty, and API-error states.
7. On user switch, clear inaccessible selected state and reload lists.

### Exit check

- Switching between Paul and Alex changes the visible owned/shared lists without a page reload.

### Commit

`feat: add document workspace and user switching`

---

## Phase 5 — Editor and Persistence

### Implements

- TR-UI-02
- TR-API-03 through TR-API-05 integration
- Core create/edit/save/refresh/reopen flow

### Work

1. Create and open an untitled document.
2. Add the editable title field.
3. Integrate TipTap using StarterKit and Underline.
4. Add bold, italic, underline, heading, bullet-list, and numbered-list controls.
5. Load stored JSON into TipTap and save `editor.getJSON()` through PATCH.
6. Implement explicit Save with dirty, saving, saved, and error states.
7. Guard document/user switching when unsaved changes exist.
8. Refresh the browser and reopen the document to verify title, content, and formatting persistence.

### Exit check

- Create → edit/format → save → refresh/reopen works reliably.

### Commit

`feat: add rich-text editing and document persistence`

---

## Phase 6 — First Deployment Checkpoint

### Implements

- Early deployment requirement
- Production configuration portion of reliability requirements

### Work

1. Deploy the backend and configure migrations, seeded users, allowed hosts, and CORS.
2. Provision managed PostgreSQL and provide its connection through `DATABASE_URL`.
3. Deploy the frontend with the production API URL.
4. Verify `X-User-Id` is allowed across origins.
5. Smoke-test create, edit, save, refresh, and reopen on the live application.

### Exit check

- The core persistence flow works at the live URL.
- Any infrastructure fallback is documented immediately.

### Commit

`chore: configure production deployment`

If deployment requires a corrective change afterward:

`fix: resolve production deployment configuration`

---

## Phase 7 — Sharing Workflow

### Implements

- TR-API-08
- TR-UI-03
- Remaining TR-AUTH-02 behavior

### Work

1. Implement the owner-only share endpoint.
2. Reject invalid users, owner self-sharing, duplicates, and non-owner attempts.
3. Add the owner-only Share button/dialog.
4. Populate eligible targets from seeded users.
5. Refresh document details and lists after sharing.
6. Switch to the recipient, confirm the document appears under Shared With Me, open it, and save an edit.
7. Confirm the shared user cannot share or delete it.

### Exit check

- Paul can share with Alex; Alex can find, open, and edit the document; unauthorized actions are blocked by the backend.

### Commit

`feat: implement document sharing workflow`

---

## Phase 8 — TXT and Markdown Import

### Implements

- TR-API-07
- TR-UI-04

### Work

1. Add a file picker limited to `.txt` and `.md`.
2. Read the file in the browser and derive the initial title from its filename.
3. Convert TXT into editable TipTap content.
4. Convert Markdown with one small dependency; fall back to editable plain text if rich conversion becomes unreliable.
5. Send `filename` and TipTap JSON to the import endpoint.
6. Validate the extension again on the backend.
7. Create, select, and open the imported document.
8. Show clear errors for unsupported types, failed reads, and API failures.

### Exit check

- Both supported file types create persisted, editable documents that reopen successfully.

### Commit

`feat: add text and markdown document import`

---

## Phase 9 — Integrated Quality Pass

### Implements

- Remaining validation and reliability requirements
- Manual testing requirements

### Work

1. Run the exact definition-of-done flow locally and on the deployed application.
2. Verify empty titles, unsupported imports, invalid identities, duplicate shares, and unauthorized access.
3. Verify switching users/documents cannot save content to the wrong record.
4. Verify useful loading, empty, saving, and error states.
5. Fix functional or deployment defects before visual polish.
6. Apply only basic responsive and accessibility cleanup that supports the demo.

### Exit check

- Every core flow and failure state works on the deployed build.
- The automated authorization test passes.

### Commit

`fix: harden core document workflows and error handling`

If the work is primarily non-bug cleanup instead:

`refactor: improve document workflow reliability`

For purely visual cleanup:

`style: refine productivity workspace interface`

Do not combine a large functional bug fix under `style:`.

---

## Phase 10 — Submission Package

### Implements

- Documentation and delivery requirements

### Work

1. Complete README setup, seeded-user, test, supported-format, deployment, and demo instructions.
2. Complete architecture decisions and explicit scope cuts.
3. Complete the AI workflow log with human decisions and verification steps.
4. Complete the submission checklist and known limitations.
5. Record a 3–5 minute walkthrough of the deployed core flow.
6. Perform one final live smoke test and validate every submitted link.

### Exit check

- Source, live application, test instructions, documentation, seeded-user guidance, and walkthrough are ready to submit.

### Commit

`docs: finalize assessment documentation and submission`

---

## Optional Work Gate

Do not begin autosave, real-time collaboration, authentication, roles, comments, version history, DOCX, export, or other stretch work unless:

1. All Phase 0–10 exit checks pass.
2. The live core flow has been smoke-tested.
3. Submission documents and walkthrough are complete.
4. A safe submission buffer remains.

If optional work is implemented, use the appropriate Conventional Commit type rather than a generic message.

Examples:

`feat: add document version history`

`feat: add autosave support`

`test: expand document API coverage`

`docs: document optional collaboration features`

`fix: prevent stale document state on user switch`

---

## Expected Core Commit History

A clean completed assessment should roughly produce:

1. `chore: initialize full-stack project structure`
2. `feat: add document persistence and seeded users`
3. `feat: implement document API and access control`
4. `test: add document sharing authorization coverage`
5. `feat: add document workspace and user switching`
6. `feat: add rich-text editing and document persistence`
7. `chore: configure production deployment`
8. `feat: implement document sharing workflow`
9. `feat: add text and markdown document import`
10. `fix: harden core document workflows and error handling`
11. `docs: finalize assessment documentation and submission`
