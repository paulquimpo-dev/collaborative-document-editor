# Collaborative Document Editor

## Submission Checklist

- [x] Source code
- [x] Live application URL
- [x] Seeded/test users
- [x] README and setup instructions
- [x] Architecture note
- [x] AI workflow note established
- [x] Automated authorization test
- [ ] 3–5 minute walkthrough video
- [x] Screenshots are optional and not required for the live submission
- [x] Known limitations
- [x] What would be built with another 2–4 hours

## Included Deliverables

The Google Drive submission folder should contain exactly:

- The complete `Collaborative Document Editor` source repository
- `README.md` — local setup, run, test, production, and reviewer instructions
- `ARCHITECTURE.md` — short architecture note and scope decisions
- `AI_WORKFLOW.md` — AI-native development workflow and human decision log
- `SUBMISSION.md` — this deliverables manifest, links, accounts, and limitations
- `WALKTHROUGH_VIDEO_URL.txt` — unlisted Loom or YouTube walkthrough URL
- Optional screenshots only if they materially help reviewers; the live product requires no extra setup

## Live Application

- Source: `https://github.com/paulquimpo-dev/collaborative-document-editor`
- Application: `https://collab-doc-qmpo.vercel.app`
- API health: `https://collaborative-document-editor-api.onrender.com/api/health/`

## Seeded Users

- Paul — `paul@example.com`
- Alex — `alex@example.com`

Run `python manage.py seed_users` after migrations. The command is idempotent and can be safely rerun during deployment.

## Walkthrough

The candidate-recorded 3–5 minute walkthrough covers the main flow, end-to-end behavior, deliberate deprioritization, implementation decisions, and AI support. Replace the placeholder in `WALKTHROUGH_VIDEO_URL.txt` after uploading the unlisted Loom or YouTube video.

## Reviewer Access

No password or production credential is required. Use the top-right simulated user switcher:

- Paul — `paul@example.com` — create/own/share/delete demonstration
- Alex — `alex@example.com` — Shared With Me/edit demonstration

The live deployment can be tested directly without local setup.

## Known Limitations

- Seeded-user switching through `X-User-Id` intentionally replaces production authentication.
- Shared users collaborate through persisted edits; there is no real-time presence, cursor synchronization, or conflict resolution.
- Markdown imports remain editable plain text rather than rendered Markdown.
- Explicit Save is the persistence baseline; autosave and version history are out of scope.
- The UI is desktop-first, and the TipTap production bundle retains a non-blocking size warning.
- Render/Vercel free-tier cold starts may delay the first request after inactivity.

## With Another 2–4 Hours

1. Add production authentication and replace the simulated identity header.
2. Add optimistic concurrency/version checks before considering real-time collaboration.
3. Add Markdown-to-TipTap conversion, broader frontend component tests, and end-to-end browser coverage.
4. Improve mobile layout and split the editor bundle after measuring production performance.
