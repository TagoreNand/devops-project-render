DevOps Advanced End-to-End Pipeline (Render + GitHub Actions + Postgres)

## What you get

- Backend: Node.js (TypeScript) + Express
- Deployment to Render as a web service
- Postgres on Render (managed database) using `DATABASE_URL`
- CI pipeline (GitHub Actions): type-check, Jest tests, build

## Project layout

- `backend/` - API service
- `.github/workflows/` - CI workflows
- `render.yaml` - optional Render blueprint (you can also configure in UI)

## Prerequisites

- A GitHub repo (or connect your local repo to GitHub)
- Render account (free tier)

## Postgres & deploy on Render (one-time setup)

You can either use the Render UI or `render.yaml`. The simplest path:

1. Push this repo to GitHub.
2. In Render, **New + → Blueprint** and point it at your GitHub repo (or create a Web Service + Postgres manually).
3. Ensure:
   - Web service root is the repo root.
   - Build command: `cd backend && npm install && npm run build`
   - Start command: `cd backend && npm install --omit=dev && npm start`
4. Create a **Postgres** instance in the same Render project.
5. In the web service settings, set the environment variable:
   - `DATABASE_URL` = the internal connection URL from the Postgres instance.

Render will:
- Build on every push (auto-deploy).
- Start the Node app.
- Your app will run migrations on first DB use if you call the migrate script manually (or you can add a small “run migrate” job as a Render cron/job if you want full automation).


