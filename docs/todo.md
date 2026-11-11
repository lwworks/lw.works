# OS performance

- [x] Route-level loading states (`loading.tsx`) for Dashboard, Kontakte, Kontakt, Zeiterfassung
- [x] Root layout streams the header's user section instead of blocking the whole shell on the session lookup
- [x] `proxy.ts` optimistic cookie check, so signed-out visitors still get a 307 to `/login` now that pages stream
- [x] Zeiterfassung week switching: instant week label + table/total skeleton while the new week loads
- [x] better-auth: load session + user in one joined query (`advanced.database.joins`)
- [x] Client router cache for dynamic pages (`staleTimes.dynamic`) so back-and-forth navigation reuses data
- [x] Lazy-load the sync date picker (react-day-picker) on first open
- [x] Lazy-load the better-auth client on click (sign-in, sign-out, calendar connect)
- [x] Login: don't download the paint background for the inactive theme; `sizes` for the paint images
- [x] Measure before/after (route JS, TTFB, DB round trips)
- [x] Thermos review + fixes

## Follow-ups

- [ ] Kontakte/Dashboard: replace the "page as loading state" with skeletons once they load real data
- [ ] Hover-intent full prefetch of the adjacent weeks (`router.prefetch` on pointer enter) for zero-wait week switches
- [ ] Session cookie cache (`session.cookieCache`) to skip the session query entirely — needs a cookie refresh path, since Server Components can't set cookies
- [ ] Evaluate Cache Components (`cacheComponents`, `unstable_instant`) to prerender the static shells instead of `loading.tsx`
- [ ] Clear a stale/revoked session cookie on `/login`, so the proxy 307s instead of the page streaming a redirect
- [ ] Check LCP on `/login` with the lazily loaded paint background

# Projekte (siehe `docs/plan.md`)

- [x] Schema `project`, `project_contact`, `time_entry.project_id`/`project_assignment` + Migration
- [x] `parseProjectKey`, `slugify`, `parseProjectInput` (+ Tests)
- [x] DB-Funktionen Projekte (list, get, insert, update, archive, restore, contacts, keys, slug)
- [x] Sync: automatische Zuordnung über `KÜRZEL:`; Rückwirkend beim Anlegen
- [x] Projekte-UI: Liste, Neu, Detail/Bearbeiten, Archivieren/Wiederherstellen
- [x] Unternehmensseite: Projekte; Löschen blockiert bei Projekten
- [x] Zeiterfassung: Projekt-Badge, Aktionsleiste (zuordnen, entfernen, automatisch)
- [x] Sidebar-Link, Typecheck, Lint, Tests
- [ ] Migration `0004_projects` auf der Datenbank ausführen (`pnpm --filter @lw/os db:migrate`)
- [ ] Im Browser durchklicken: Projekt anlegen, rückwirkende Zuordnung, Sync, Mehrfachauswahl, Archivieren/Wiederherstellen
