# Automation-App (`apps/automation`)

Eigene App im Monorepo für Webhooks, Relays und Automatisierungen ohne UI. Eigenes Vercel-Projekt, erreichbar unter `automation.lw.works`. Erster Bewohner: der Linear-Relay für Atlas (PR #38), der bisher in `apps/os` liegt.

## Abgrenzung

In `apps/automation` gehört, was
- von externen Diensten aufgerufen wird (Webhooks von Linear, GitHub, Stripe, Cal.com, …),
- Ereignisse zwischen Diensten weiterreicht (Relay, Fan-out an Agenten oder Routinen),
- weder Login noch OS-Daten braucht.

Im OS bleibt, was die OS-Datenbank oder OS-Sessions braucht. Das betrifft auch die bestehenden Crons (`calendar-sync`, `contacts-sync`, `sevdesk-sync`). Braucht eine Automation später OS-Daten, ruft sie einen authentifizierten OS-Endpunkt auf. Sie greift nicht direkt auf die Datenbank zu.

## Framework-Vergleich

| Option | Pro | Contra |
| --- | --- | --- |
| **Hono** (empfohlen) | Zero-Config auf Vercel (Fluid Compute). Sehr klein, Web-Standard `Request`/`Response`. Explizites Routing in einer Datei. Middleware für Signaturprüfung pro Anbieter. Tests ohne Server über `app.request()` in Vitest. `waitUntil` aus `@vercel/functions` ersetzt `after()`. | Neues Framework im Repo. Für Vercel Workflow braucht es zusätzlich Nitro als Build-Schicht. |
| **Next.js nur mit Route Handlers** | Gleiche Toolchain wie `web`/`os` (ESLint-, TS-Config, `after()`). Workflow wird nativ unterstützt. | React, App Router und `.next`-Build für eine App ohne Seiten. Längere Builds und Kaltstarts. Die AGENTS.md-Warnung „This is NOT the Next.js you know“ gilt dann auch hier. |
| **Nitro (H3)** | Zero-Config auf Vercel. Dateibasierte Routen, `event.waitUntil`, eingebaute Tasks. Workflow wird nativ unterstützt. | Mehr Magie (Auto-Imports, eigener Build). Weniger verbreitet als Hono. |
| Reine Vercel Functions (`api/*.ts`) | Kein Framework. | Kein gemeinsames Routing, keine Middleware, lokales Dev nur über `vercel dev`. |

**Empfehlung: Hono.** Die App besteht nur aus Endpunkten. Hono ist dafür das schlankste Setup mit offiziellem Vercel-Support. Der bestehende Relay-Code ist bereits Framework-neutral: `handleWebhook(request, schedule)` arbeitet mit Web-`Request`, und `schedule` wird `waitUntil`. Brauchen wir später langlebige, mehrstufige Abläufe (Retries, Warten auf Events), kommt Vercel Workflow über das offizielle Hono-Setup mit `workflow/nitro` dazu. Ein Framework-Wechsel ist dafür nicht nötig.

## Setup

```
apps/automation/
├── package.json          # @lw/automation
├── tsconfig.json         # extends @lw/typescript-config/base.json
├── eslint.config.mjs     # neues Preset @lw/eslint-config/node (ohne React/Next)
├── vitest.config.mts
├── .env.example
└── src/
    ├── index.ts          # Hono-App, `export default app` (Vercel-Entry)
    ├── dev.ts            # lokaler Server über @hono/node-server, Port 3002
    ├── routes/
    │   └── linear.ts     # app.route('/linear', linear) → POST /linear/agent
    └── lib/
        └── linear-agent/ # aus apps/os übernommen, eine Funktion pro Datei
```

- Abhängigkeiten: `hono`, `@vercel/functions`, `zod` (gleiche Version wie im OS), dev: `@hono/node-server`, `tsx`, `vitest`. `.env.local` lädt der Dev-Server über `--env-file-if-exists`.
- Scripts: `dev` (`tsx watch`), `lint`, `typecheck`, `test`. Root: `pnpm dev:automation`.
- Konventionen wie in `apps/os/AGENTS.md`: Logik in `src/lib/<service>/`, eine Funktion pro Datei. Routen bleiben dünn. Ein eigenes `apps/automation/AGENTS.md` beschreibt das kurz.
- `import 'server-only'` entfällt, weil es ein Next-Konstrukt ist. In dieser App gibt es keinen Client-Code.
- `GET /` liefert einen Health-Check (`{ ok: true }`). Alle anderen Routen sind POST und prüfen ihre Absender selbst: Linear per HMAC, eigene Trigger per Bearer-Secret, Crons per `CRON_SECRET`.
- Fehler loggen nur Namen und Status, keine Payloads oder Secrets.

## Vercel

- Neues Projekt `lw-automation`, Root Directory `apps/automation`, Framework „Hono“ (sollte automatisch erkannt werden).
- Domain `automation.lw.works`.
- Env-Variablen aus dem OS-Projekt umziehen: `LINEAR_WEBHOOK_SECRET`, `LINEAR_CLIENT_ID`, `LINEAR_CLIENT_SECRET`, Routine-URL/-Key, Allowlist. Im OS-Projekt danach entfernen.
- Deployment Protection für Previews prüfen: Linear muss Production erreichen. Previews sind nur für manuelle Tests da.
- **Zu verifizieren:** Zero-Config-Erkennung im Monorepo-Unterordner mit `workspace:`-Abhängigkeiten. Laut einem Drittanbieter-Guide braucht es dafür eventuell einen eigenen Build-Command. Das klärt das erste Preview-Deployment.

## Migration des Linear-Relays (PR #38)

PR #38 ist noch nicht gemergt. Deshalb ziehen wir den Code im selben Branch um, statt ihn erst im OS zu mergen.

1. `apps/automation` scaffolden (siehe Setup) und den Health-Check samt Test ergänzen.
2. `apps/os/src/lib/linear-agent/*` nach `apps/automation/src/lib/linear-agent/` verschieben, `server-only` entfernen und die Tests unverändert mitnehmen.
3. Route `POST /linear/agent`: `c.req.raw` an `handleWebhook(request, (work) => waitUntil(work()))` übergeben und den Status zurückgeben.
4. `apps/os/src/app/api/linear-agent` löschen.
5. Doku `docs/linear-agent.md`: Webhook-URL auf `https://automation.lw.works/linear/agent` ändern und die Vercel-Projekt-Einrichtung ergänzen. README-Tabelle um `@lw/automation` erweitern, Root-`AGENTS.md` um die App ergänzen.
6. Lint, Typecheck und Tests laufen über Turbo für alle Pakete.

## Später

- Vercel Workflow (`workflow` + `workflow/nitro`) für mehrstufige Automationen mit Retries.
- Vercel Queues, falls Webhooks gepuffert oder an mehrere Konsumenten verteilt werden sollen.
- Vercel Connect als Alternative zur eigenen Signaturprüfung und Token-Verwaltung für Linear, Slack und GitHub prüfen, sobald mehrere Integrationen OAuth-Tokens brauchen.

## Entscheidungen

- Domain: `automation.lw.works`.
- Pfade nach Dienst gruppiert: `POST /linear/agent`.
- Der Relay zieht direkt in PR #38 um.
- `build`-Script gibt es bewusst nicht: Vercel baut die Hono-App selbst, `typecheck` deckt `tsc` ab. Env-Variablen werden nur zur Laufzeit gelesen, deshalb gibt es keine `turbo.json` in der App.
- Abhängigkeiten nutzen die bereits im Lockfile vorhandenen Versionen (`hono` 4.12, `zod` 4.3.6), damit `web` und `os` unverändert bleiben.
