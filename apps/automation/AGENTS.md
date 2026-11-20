# `apps/automation` — Webhooks und Automatisierungen

Follow the root `AGENTS.md` too. Hono app without UI, deployed as its own Vercel project to `automation.lw.works`. Plan: `docs/plan-automation.md`.

## Scope

Endpoints that external services call (webhooks, relays to agents or routines) and that need neither a login nor OS data. Anything that needs the OS database or OS sessions stays in `apps/os`; if an automation needs OS data later, it calls an authenticated OS endpoint.

## Layout

```
src/
├── index.ts          # Hono app, `export default app` (Vercel entry, zero-config)
├── dev.ts            # local server via @hono/node-server, port 3002
├── routes/<service>.ts   # one router per service, mounted at /<service>
└── lib/<service>/    # all logic, one exported function per file, tests next to it
```

- Routes stay thin: parse the request, call `@/lib`-style functions from `src/lib/<service>/`, respond. Paths are grouped by service: `POST /linear/agent`.
- Work after the response goes through `waitUntil` from `@vercel/functions` (not Next.js `after()`).
- Every route authenticates its caller itself: provider signature (e.g. Linear HMAC over the raw body), bearer secret for own triggers, `CRON_SECRET` for crons.
- Log only names and status codes, never payloads, tokens or secrets.
- No Next.js imports and no `server-only` — this app has no client code.
- Relative imports end in `.js` (`import { linear } from './routes/linear.js'`). Vercel runs the compiled files as unbundled ESM, so extensionless imports crash at runtime with `ERR_MODULE_NOT_FOUND`; `tsc` (`moduleResolution: nodenext`) rejects them.
