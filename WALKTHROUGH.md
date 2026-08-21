# Collaborative Document Editor — Walkthrough Script

Target length: 3–5 minutes.

## 0:00–0:30 — Introduction

- Show the live URL and identify the project as **Collaborative Document Editor**.
- State the stack: React/TypeScript/TipTap, Django REST Framework, and PostgreSQL.
- Explain that the assessment prioritizes a complete deployed workflow over optional real-time collaboration or production authentication.

## 0:30–1:35 — Create, Edit, and Persist

1. Select Paul in the simulated user switcher.
2. Create a document and rename it.
3. Demonstrate heading, bold, italic or underline, and a list.
4. Point out Unsaved changes, click Save, and show Saved.
5. Refresh, reopen from **My Documents**, and show that title, content, and formatting persisted.

## 1:35–2:05 — Import

1. Import a small `.txt` or `.md` file.
2. Show the filename-derived title and editable imported content.
3. Mention that the browser reads the source and the backend independently validates the extension; source files are not stored.

## 2:05–3:10 — Share and Switch Users

1. As Paul, open Share and select Alex.
2. Switch to Alex and show the document under **Shared With Me**.
3. Open it, point out `Shared by Paul`, edit, and save.
4. Show that Alex has no Share or Delete action.
5. Switch back to Paul and show Alex's persisted edit.

## 3:10–3:40 — Authorization and Engineering Decisions

- Explain that `X-User-Id` deliberately simulates identity, while all ownership and sharing permissions are enforced by Django.
- Mention structured TipTap JSON persistence, owner/shared queryset filtering, PostgreSQL constraints, and automated authorization tests.
- Briefly show the seven passing backend tests if useful.

## 3:40–4:10 — Scope and Close

- Mention explicit Save, plain-editable Markdown fallback, desktop-first UI, and free-tier cold starts as deliberate limitations.
- Close with the live application, repository, architecture note, AI workflow log, and deployment configuration.

Before recording, create one short import fixture and remove unrelated test documents so the sidebar is easy to follow.
