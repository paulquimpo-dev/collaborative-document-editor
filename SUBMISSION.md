# Collaborative Document Editor

## Submission Checklist

- [ ] Source code
- [x] Live application URL
- [ ] Seeded/test users
- [ ] README and setup instructions
- [ ] Architecture note
- [x] AI workflow note established
- [x] Automated authorization test
- [ ] 3–5 minute walkthrough video
- [ ] Screenshots, if included
- [ ] Known limitations
- [ ] What would be built with another 2–4 hours

## Live Application

- Application: `https://collab-doc-qmpo.vercel.app`
- API health: `https://collaborative-document-editor-api.onrender.com/api/health/`

## Seeded Users

- Paul — `paul@example.com`
- Alex — `alex@example.com`

Run `python manage.py seed_users` after migrations. The command is idempotent and can be safely rerun during deployment.

## Walkthrough

To be added after the deployed flow is verified.

## Known Limitations

PostgreSQL is used locally and is provisioned as the production database by the Render Blueprint. Render/Vercel free-tier cold starts may delay the first request after inactivity. Any emergency fallback or additional hosting limitation will be disclosed here if encountered during deployment.

## With Another 2–4 Hours

To be finalized after the required submission is complete. Potential work remains limited to the roadmap in `CDE_MASTER_BLUEPRINT.md`.
