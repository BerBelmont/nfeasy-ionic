This repository was migrated from a Next.js + Ionic hybrid to a single Ionic React (Vite) app with an Express backend.

Files/folders that are now deprecated and safe to remove or review:

- `app/` — Next.js App Router pages and API routes. The code is deprecated; APIs should be served from `server/`.
- `next.config.mjs`, `next-env.d.ts`, `middleware.ts` — Next-specific configuration and middleware (kept as placeholders).

Recommended next actions before final deletion:

1. Review `app/` to ensure no unique functionality is missing in `src/` or `server/`.
2. Commit a branch/backup containing the `app/` folder if you want a rollback point.
3. Delete `app/` and other Next artifacts.
4. Remove any Next-related dev dependencies if present in `package.json`.

Notes on Android emulator networking:
- The Android emulator accesses the host's localhost via `10.0.2.2`.
- `capacitor.config.ts` was updated to point to `http://10.0.2.2:3001` by default for development. Override with `CAPACITOR_DEV_SERVER_URL` if needed.

If you want, I can now:
- delete the `app/` folder contents permanently (I will create a branch/backup first), or
- create a branch and then remove `app/` and clean package.json and typescript configs.
