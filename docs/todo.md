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

# OS: Kontakt-Sidebar, Favicons, Projekt-Icons

- [x] Google-Kontakte-Hinweis: Scope-Prüfung liest better-auths komma-getrennte Scopes (betraf auch Pull/Push-Sync)
- [x] Hinweise/Karten in Sections → volle Breite mit horizontaler Border (`NoticeBar`, Visitenkarten-Scan)
- [x] Kontaktdetails: Sidebar mit Eigenschaften (Unternehmen, Privat), Tags-Picker (umschalten + neu anlegen), Löschen
- [x] Unternehmens-Icons aus dem Favicon der Website (`/unternehmen/[id]/icon`)
- [x] Logos in Neon Object Storage: einmaliger Favicon-Import im Hintergrund nach dem Anlegen (`after()`), Upload + „Favicon der Website“ im Bearbeiten-Dialog, versionierte Icon-URLs
- [x] Bestehende Unternehmen: Import beim ersten Icon-Abruf (alte Logo-URL zuerst, sonst Favicon)
- [x] Projekte zeigen immer das Icon ihres Unternehmens (`ProjectBadge`, Projekttabelle, Zuordnen-Menü)
- [x] Bucket `uploads` in Neon angelegt (`neon.ts`, lokal `AWS_*` aus `neon deploy`)
- [ ] `OBJECT_STORAGE_*` in Vercel setzen (Production + Preview)
- [x] Migration `0006_company-logos` ausgeführt
- [ ] Im Browser prüfen (eingeloggt): Sidebar-Layout, Tag-Picker, Logo-Upload, Favicons in Hell/Dunkel
- [ ] Später: Spalte `company.logo_url` entfernen, sobald alle Unternehmen `logo_checked_at` haben
