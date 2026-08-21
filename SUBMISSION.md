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

## Live Application

- Source: `https://github.com/paulquimpo-dev/collaborative-document-editor`
- Application: `https://collab-doc-qmpo.vercel.app`
- API health: `https://collaborative-document-editor-api.onrender.com/api/health/`

## Seeded Users

- Paul — `paul@example.com`
- Alex — `alex@example.com`

Run `python manage.py seed_users` after migrations. The command is idempotent and can be safely rerun during deployment.

## Walkthrough

The recording script is ready in `WALKTHROUGH.md`. Add the candidate-recorded 3–5 minute video URL here before final submission.

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
