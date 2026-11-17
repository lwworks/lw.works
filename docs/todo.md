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

# Projekte (siehe `docs/plan-projekte.md`)

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

# Finanzen / SevDesk (siehe `docs/plan-finanzen.md`)

- [x] SevDesk-API-Token erzeugen, `SEVDESK_API_TOKEN` in `.env.local`
- [x] `SEVDESK_API_TOKEN` in `.env.example` und `turbo.json`
- [ ] `SEVDESK_API_TOKEN` in Vercel (Production + Preview)
- [x] API-Spike: EUR-Beträge bei Fremdwährung, Stornos, Gutschriften, Status, Kontakte, Positionen, PDF, Deep-Links → im Plan eintragen
- [x] `user.role` (better-auth `additionalFields`), `isAdmin`/`requireAdmin`, eigene Rolle per SQL auf `admin` setzen
- [x] Schema `sevdesk_contact`, `invoice`, `sevdesk_sync_state`, `company.sevdesk_contact_id` + Migration `0009_finance`
- [x] `lib/sevdesk`: Fetch, Listen, Mapping (+ Tests), Positionen, PDF, Deep-Links
- [x] Sync (Vollabgleich, Advisory-Lock, Sync-State), Cron `/api/cron/sevdesk-sync` stündlich, manueller Sync-Button
- [x] DB-Funktionen Rechnungen, Monatsumsatz, Summen, SevDesk-Kontakte, Verknüpfung
- [x] `lib/finance`: Zeitraum-Parsing, Vergleichszeitraum, überfällig, Namensvorschlag, `formatMoney` (+ Tests)
- [x] shadcn `chart` installieren, `lucide-react` ersetzen
- [x] Sidebar + mobiles Menü: `children`, `adminOnly`, Unterpunkte nur unter `/finanzen`
- [x] `/finanzen`: Zeitraum, Vergleich, KPIs, Diagramm, Hinweis auf nicht zugeordnete Kunden, Sync-Status
- [x] `/finanzen/rechnungen`: Tabs, Jahresfilter, Tabelle
- [x] `/finanzen/rechnungen/[id]`: Detail, Positionen live, PDF-Route, SevDesk-Link
- [x] Unternehmensseite: SevDesk-Kunde verknüpfen (Vorschlag), Kundennummer + Link, Umsatz, Rechnungen
- [x] Dashboard-Kachel
- [x] Typecheck, Lint, Tests, Build; Migration auf Production; erster Sync (72 Kunden, 204 Belege); Abfragen gegen echte Daten geprüft
- [ ] Im Browser durchklicken: /finanzen (Zeiträume, Vergleich, Balken-Klick), Rechnungen (Tabs, Jahre, PDF), Detail, Unternehmen verknüpfen, Dashboard
- [ ] Deep-Links in SevDesk prüfen (`get-sevdesk-document-url.ts`, `get-sevdesk-contact-url.ts`)
- [ ] Nicht-Admin prüfen: kein Menüpunkt, 404 auf /finanzen, keine SevDesk-Sektion
- [ ] Unternehmen mit SevDesk-Kunden verknüpfen (64 Kunden mit Rechnungen noch offen)
- [ ] Später: Zeiteinträge → Rechnungsentwurf in SevDesk (`time_entry.invoice_id`)

# Notizen (siehe `docs/plan-notizen.md`)

- [x] Schema `note` (Kontakt/Unternehmen/Projekt, genau ein Besitzer) + Migration `0010_notes`
- [x] `parseNoteDoc`, `safeNoteHref` (+ Tests)
- [x] DB-Funktionen: insert, list (Kontakt), getOwn, update, delete
- [x] Tiptap-Editor (fett, kursiv, Listen, Links), Darstellung ohne HTML
- [x] Kontaktseite: Notizen anlegen, bearbeiten, löschen
- [x] Migration `0010_notes` auf der Datenbank ausführen (`pnpm --filter @lw/os db:migrate`)
- [ ] Im Browser durchklicken: Notiz anlegen, Formatierung, Link setzen/entfernen, Bearbeiten, Löschen, Hell/Dunkel
- [ ] Notizen für Unternehmen
- [ ] Notizen für Projekte
