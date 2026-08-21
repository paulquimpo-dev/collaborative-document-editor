# Collaborative Document Editor — Implementation Rules

## Environment Configuration

- Never hardcode API base URLs, service origins, database URLs, credentials, secrets, deployment hosts, or other environment-specific infrastructure values in application code.
- Read backend environment configuration from `backend/.env` locally and deployment-platform environment variables in hosted environments.
- Read browser-safe frontend configuration from `frontend/.env` locally and frontend deployment-platform environment variables when hosted.
- Frontend environment variables exposed to the browser must use the `VITE_` prefix and must never contain secrets.
- Build API requests by combining the environment-provided API base URL with relative endpoint paths.
- Relative endpoint paths such as `/documents/` are application contract constants and do not require separate environment variables.
- Required configuration must fail clearly when missing; do not silently point to an unrelated local or production service.
- Keep actual `.env` files ignored. Commit only `.env.example` templates with placeholders.
- When adding an environment variable, update the appropriate `.env.example`, README setup instructions, and deployment documentation in the same phase.
