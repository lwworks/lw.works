# `apps/os` — internal OS app

Follow the root `AGENTS.md` too. This file adds the OS app's code layout rule.

## All logic lives in `src/lib/<service>/`

Every `get*` function and every other piece of core logic — database queries, Google APIs, auth, crypto, formatting, calculations — lives in `src/lib`, in one folder per service, **one exported function per file**, file named after the function (`getOwnTimeEntries` → `get-own-time-entries.ts`). Tests sit next to the file (`*.test.ts`).

`src/app` (pages, route handlers, server actions) and `src/components` contain no queries or business logic: they only import from `@/lib/...` and render or respond.

```
src/lib/
├── auth/              # better-auth instance + client, getSession, requireUserId, isCronRequest, preview OAuth proxy helpers
├── crypto/            # safeEqual
├── db/
│   ├── get-db.ts
│   ├── schema/        # Drizzle tables (drizzle.config.ts points here)
│   ├── calendar-sync-states/  # get-own-calendar-sync.ts, lock-calendar-sync-state.ts, …
│   └── time-entries/  # one folder per table: get-own-time-entries.ts, upsert-time-entries.ts, …
├── format/            # format-duration.ts, …
├── google-calendar/   # list-events.ts, sync-calendar-state.ts, …
├── iso-week/          # ISO weeks in Europe/Berlin: get-current-iso-week.ts, get-iso-week-range.ts, …
├── time-tracking/     # parse-sync-range.ts, sum-tracked-ms.ts, toggle-row-selection.ts, toggle-group-selection.ts, …
└── fonts.ts           # next/font loaders: Geist, Geist Mono, Safiro
```

- New query → `src/lib/db/<table>/<verb>-<thing>.ts`. New external API → `src/lib/<service>/`.
- Small private helpers stay in the file that uses them; split them out only when a second file needs them.
- Server-only modules start with `import 'server-only'`. Reads of user data take the user ID from the session (`requireUserId`), never from arguments passed in by the client.
