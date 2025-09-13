# Snippets Library

Snippets Library is a full-stack code snippet manager built with Next.js, TypeScript and Drizzle ORM. It provides authenticated snippet storage, syntax highlighting, instant search, public sharing, bookmarking, likes and view tracking.

This README summarizes the current codebase, how to run it locally, the main API surface and important implementation details discovered in the repository.

## Key features

- Save, edit and delete code snippets.
- Automatic/assisted language detection (highlight.js on the server and a custom detector in the client libs).
- Syntax highlighting via Shiki with a cached highlighting service.
- Public share links (secure random share IDs) with view counting, like/unlike and copy-as-new-snippet.
- Bookmarks per-user.
- GitHub OAuth sign-in using NextAuth and a Drizzle adapter.
- Settings persisted per user including code theme and preferences.

## Tech stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Drizzle ORM (Postgres)
- NextAuth (GitHub provider) with @auth/drizzle-adapter
- Shiki for server-side/high-quality code highlighting
- highlight.js for quick language detection endpoint
- Tailwind CSS (utility classes used in components)

## Repository scripts

The most relevant npm scripts are defined in `package.json`:

- `npm run dev` — formats with Prettier and runs Next.js in dev mode (port 3001 by default)
- `npm run build` — builds the Next.js app
- `npm run start` — runs the built Next.js app (port 3001)
- `npm run lint` — runs Next.js ESLint
- `npm run db:generate` — drizzle-kit generate
- `npm run db:migrate` — drizzle-kit migrate and push
- `npm run db:studio` — drizzle-kit studio
- `npm run migrate` — runs generate then migrate

Use `npm run format` to format the `./src` source files with Prettier.

## Environment variables

Create a `.env` (or set env vars in your hosting environment) with at least the following values:

- `DATABASE_URL` — Postgres connection string
- `GITHUB_CLIENT_ID` — GitHub OAuth client id
- `GITHUB_CLIENT_SECRET` — GitHub OAuth client secret
- `AUTH_SECRET` — NextAuth secret (used by NextAuth)
- `NEXT_PUBLIC_APP_URL` — public application URL (used for metadata/OG)
- `IP_HASH_SALT` — optional salt used to hash visitor IPs (default placeholder exists in code)

Example (not checked in):

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/snippets
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
AUTH_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3001
IP_HASH_SALT=change-this-in-production
```

## Database

The project uses Drizzle ORM and the schema is defined in `src/db/schema.ts`. Main tables include:

- `users` — stores user profile and settings (jsonb settings object)
- `snippets` — stores snippets: id, title, description, code, language, tags (jsonb array), isPublic, shareId, viewCount, userId
- `snippet_views` — tracks views (hashed IP + optional userId) for deduplication
- `snippet_likes` — likes for public snippets (by user or by hashed IP)
- `snippet_bookmarks` — bookmarks association table between users and snippets

There are drizzle-kit scripts in `package.json` to generate migrations and push them to the database.

## Authentication

Authentication is implemented with NextAuth in `src/lib/auth.ts` using the GitHub provider and a Drizzle adapter. Sessions are stored in a database-backed session table. New users receive default settings on first sign-in.

The session callback attaches `user.id` and a small settings payload to the session object.

## Notable server-side utilities

- `src/lib/shiki.ts` — Shiki-based highlighting service with caching, language and theme fallbacks, and preloading logic. The service exposes functions to highlight code and list available themes/languages.
- `src/lib/detect-lang.ts` — a deterministic, signature-based language detector used for fallback detection.
- `src/lib/security.ts` — helpers to generate secure share IDs (nanoid with custom alphabet), validate them, hash IP addresses (SHA-256, truncated) and retrieve client IP from request headers.

## API surface

The app exposes several Next.js route handlers under `src/app/api`. The important endpoints are:

Authentication (NextAuth):

- `GET|POST /api/auth/*` — NextAuth routes (sign in, callback, session, sign out, etc.)

Snippets management (requires authenticated session):

- `GET /api/snippets` — list a user's snippets (supports search, language filter, tags, pagination)
- `POST /api/snippets` — create a new snippet
- `GET /api/snippets/:id` — read a user's snippet
- `PUT /api/snippets/:id` — update a snippet (can toggle public/shareId generation)
- `DELETE /api/snippets/:id` — delete a snippet
- `POST /api/snippets/:id/bookmark` — bookmark a snippet
- `DELETE /api/snippets/:id/bookmark` — remove bookmark

Public/shared snippet actions (shareId-based):

- `GET /api/snippets/share/:shareId` — fetch a public snippet by shareId (includes likes info)
- `POST /api/snippets/share/:shareId` — copy a public snippet into the authenticated user's library
- `POST /api/snippets/share/:shareId/view` — track a view (deduplicates by user or hashed IP)
- `POST /api/snippets/share/:shareId/like` — like a public snippet (by user or by hashed IP)
- `DELETE /api/snippets/share/:shareId/like` — unlike

Utility endpoints:

- `POST /api/detect-language` — quick language detection using highlight.js (body: { code })
- `GET /api/health` — basic health check
- `GET|PUT /api/settings` — user settings endpoint (server-side)
- `GET /api/settings/public-seo` — public SEO settings endpoint

When calling API endpoints that modify user data, the code checks the authenticated session using the `auth()` helper exported by the NextAuth config.

Error handling: most routes return JSON errors with appropriate HTTP status codes (401 for unauthorized, 404 for not found, 400 for validation errors and 500 for server errors).

## Running locally

Prerequisites:

- Node.js / npm (the repo uses npm scripts and Next.js). The codebase expects Node compatible with Next 15.
- PostgreSQL database running and reachable via `DATABASE_URL`.

Local steps:

1. Install dependencies

```bash
npm install
```

2. Create `.env` with the variables listed above.

3. Run database migrations

```bash
npm run migrate
```

4. Start the dev server

```bash
npm run dev
```

The app will start in development mode (default port configured in scripts is 3001). Visit `http://localhost:3001` (or the URL configured in `NEXT_PUBLIC_APP_URL`).

## Build & deploy

To build a production bundle:

```bash
npm run build
npm run start
```

Deployment notes:

- Environment variables must be set in the production environment (database, GitHub OAuth, AUTH_SECRET, app URL, IP hash salt).
- The project contains drizzle-kit commands for migrations. Run them as part of your deployment workflow.

## Code highlights and architecture notes

- The app uses the Next.js App Router. Server route handlers live in `src/app/api/*`.
- The database schema in `src/db/schema.ts` uses typed jsonb settings and sensible defaults for new users.
- Syntax highlighting is handled server-side with a Shiki service that caches rendered HTML. For language detection there is a light-weight `detect-language` route using highlight.js.
- Share IDs are a 24-character nanoid using a custom alphabet and validated before use.

## Testing & quality gates

- The repository includes ESLint and Prettier configuration. Run `npm run lint` and `npm run format` before committing.
- There are no unit tests included in the repository snapshot; if you add tests, prefer Jest or Vitest for fast feedback.

## Contributing

If you want to contribute:

1. Fork the repository.
2. Create a branch for your feature/fix.
3. Run lint/format and ensure TypeScript types are satisfied.
4. Open a PR targeting the `master` branch (current working branch here is `v2`).

When adding features that change the database, add a Drizzle migration (drizzle-kit) and include migration instructions in your PR.

## License

This project is released under the MIT license. See the `LICENSE` file for details.

## Where to look in the code

- Entry UI and pages: `src/app/*` (landing page, dashboard, API routes under `src/app/api`).
- Auth & session: `src/lib/auth.ts`.
- DB schema: `src/db/schema.ts`.
- Highlighting and language utilities: `src/lib/shiki.ts`, `src/lib/detect-lang.ts`.
- Security helpers (share ID, IP hashing): `src/lib/security.ts`.

If you want a specific section expanded (examples, full API docs, or deployment recipe for a cloud provider), tell me which target environment and I will add a tailored guide.
