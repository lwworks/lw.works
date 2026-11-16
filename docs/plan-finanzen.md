# Finanzen (SevDesk)

Status: **Implementiert** auf Branch `finanzen`. Migration `0009_finance` ist auf Production ausgeführt, der erste Sync ist gelaufen. Offen: Vergleich im Browser, Deep-Links prüfen, Vercel-Env.

## Ziel

Neuer Bereich **Finanzen** in `apps/os`. Rechnungen werden weiter in SevDesk geschrieben. Das OS zeigt sie an und wertet sie aus:

- Übersicht `/finanzen` mit KPIs und einem Diagramm der Einnahmen pro Monat in einem frei wählbaren Zeitraum
- Rechnungsliste `/finanzen/rechnungen` mit Tabs und Jahresfilter
- Detailseite pro Rechnung mit Positionen, PDF und Link zu SevDesk
- Ein OS-Unternehmen lässt sich mit einem SevDesk-Kunden verknüpfen. Die Unternehmensseite zeigt dann Kundennummer, Link, Umsatz und Rechnungen
- Kachel auf dem Dashboard

Nur Nutzer mit der Rolle `admin` sehen Finanzdaten.

## Entscheidungen

| Thema | Entscheidung |
|---|---|
| Datenquelle | Sync aus der SevDesk-API in eigene Tabellen: Cron stündlich + Button „Jetzt synchronisieren“. Positionen und PDF werden live geholt und nicht gespeichert. |
| Einnahme eines Monats | **Netto**-Betrag nach **Rechnungsdatum**, egal ob bezahlt |
| Entwürfe | in der Liste sichtbar, im Diagramm und in den KPIs **nie** mitgezählt |
| Stornos/Gutschriften | werden mit negativem Betrag im Monat ihres eigenen Datums mitgezählt |
| Historie | Alle Rechnungen seit Beginn |
| Währungen | Fremdwährungen möglich. Für Diagramm/KPIs werden **EUR-Beträge** verwendet (siehe Schritt 0). In Liste und Detail steht zusätzlich der Originalbetrag. |
| Zugriff | Spalte `user.role` (`admin` \| `member`) |
| Verknüpfung | nur Unternehmen ↔ SevDesk-Kunde (1:1), keine Projekte |
| Zeiteinträge | jetzt keine Verknüpfung. Vorbereitung siehe „Später“ |

## Schritt 0: API-Spike (vor dem Schema)

Mit einem echten Token gegen die SevDesk-API v1 (`https://my.sevdesk.de/api/v1`, Header `Authorization: <token>`) prüfen und das Ergebnis hier eintragen:

1. `GET /Invoice?embed=contact&limit=…&offset=…`: welche Felder liefern den Netto-/Bruttobetrag in EUR bei Fremdwährungsrechnungen (`sumNet` vs. `sumNetForeignCurrency` / `sumNetAccounting`, `currency`, `currencyFactor`)? **Bevorzugt den Umrechnungskurs, den SevDesk selbst gespeichert hat.** Nur wenn er fehlt: EZB-Kurs am Rechnungsdatum beim Sync holen und speichern.
2. Wie sehen Stornos aus (`invoiceType = 'SR'`, Vorzeichen der Summen, Status der stornierten Originalrechnung)? Ergebnis muss sein: Original + Storno ergeben netto 0.
3. Gutschriften: eigener Endpunkt `/CreditNote` oder Rechnungstyp? Gleiche Fragen zu Vorzeichen und Status.
4. Status-Codes (`100` Entwurf, `200` offen, `750` teilweise bezahlt, `1000` bezahlt, …), Feld für das Bezahlt-Datum (`payDate`), Fälligkeit (`timeToPay` in Tagen ab `invoiceDate`).
5. `GET /Contact?depth=1`: Kundennummer (`customerNumber`), Name (Organisation vs. Person), Kategorie „Kunde“.
6. `GET /Invoice/{id}/getPositions`, `GET /Invoice/{id}/getPdf` (Base64?).
7. Deep-Links in die SevDesk-Web-App für Rechnung und Kontakt (Vermutung: `https://my.sevdesk.de/fi/detail/type/RE/id/{id}` und `https://my.sevdesk.de/crm/detail/id/{id}`).

### Ergebnisse (16.11.2026)

Bestand: 203 Rechnungen (seit 01/2023), davon 2 Stornos, 3 Entwürfe, 3 offen. Dazu 1 Gutschrift und 94 Kontakte.

- **Beträge:** `sumNet`/`sumGross` sind immer in EUR (identisch mit `sumNetAccounting`), auch bei USD-Rechnungen. Der Originalbetrag in Fremdwährung steht in `sumNetForeignCurrency`/`sumGrossForeignCurrency` (bei EUR `0`). Einen Kurs muss das OS also nicht selbst holen. Alle Zahlen kommen als Strings.
- **Stornos:** `invoiceType = 'SR'`, negative Summen, eigene Nummer und eigenes Datum, `origin` → Originalrechnung. Das Original bleibt in SevDesk auf Status `1000` mit `payDate = null`. Das OS markiert es beim Sync als `cancelled`. Original + Storno ergeben netto 0.
- **Gutschriften:** eigener Endpunkt `/CreditNote` (`creditNoteNumber`, `creditNoteDate`, `creditNoteType = 'CN'`, `refSrcInvoice`). Die Summen sind **positiv**, das OS negiert sie.
- **Status:** `100` Entwurf, `200` offen, `750` teilweise bezahlt, `1000` bezahlt. Bezahlt am: `payDate`, Betrag: `paidAmount`. Fällig: `invoiceDate + timeToPay` Tage.
- **Entwürfe** tragen schon eine vorläufige Nummer, die doppelt vorkommen kann (z. B. `R#26068` als Entwurf und als offene Rechnung). Die Nummer ist also nicht eindeutig, URLs nutzen die SevDesk-ID.
- **Kontakte:** Rechnungen gehen oft an eine **Person** (`surename`/`familyname`), deren `parent` die Firma (`name`) ist. Beide haben dieselbe `customerNumber`. **Kunde = oberster Kontakt** (Firma, bei Privatkunden die Person selbst). Gesynct werden nur oberste Kontakte, die Rechnung zeigt auf den Kunden.
- **Positionen:** `GET /Invoice/{id}/getPositions` bzw. `/CreditNote/{id}/getPositions` mit `name`, `text`, `quantity`, `priceNet`, `sumNet`, `taxRate` sowie `*ForeignCurrency`.
- **PDF:** `GET /Invoice/{id}/getPdf?download=false&preventSendBy=true` bzw. `/CreditNote/…` liefert **direkte PDF-Bytes**. `preventSendBy=true` ist Pflicht, sonst markiert SevDesk die Rechnung als versendet.
- **Deep-Links:** über die API nicht prüfbar, im Browser verifizieren.

## Datenmodell

Neue Datei `src/lib/db/schema/finance.ts` (Export über `schema/index.ts`), Migration `0009_finance.sql`. Abweichend vom ersten Entwurf: `invoice.id` ist bei Gutschriften `cn-<id>` (eigene SevDesk-Tabelle), zusätzlich `sevdesk_id`, `original_invoice_id`, `paid_eur_cents` und Status `cancelled`. Mahnungen (`MA`) und Abo-Vorlagen (`WKR`) werden nicht übernommen.

```ts
export type UserRole = 'admin' | 'member'
// user.role: text NOT NULL DEFAULT 'member' – über better-auth `user.additionalFields` (input: false), Schema per `pnpm auth:generate`

export type InvoiceKind = 'invoice' | 'cancellation' | 'credit_note'
export type InvoiceStatus = 'draft' | 'open' | 'partially_paid' | 'paid'

sevdesk_contact               // SevDesk-Kunden, vom Sync gepflegt
  id               text PK      // SevDesk-ID
  customer_number  text
  name             text NOT NULL
  synced_at        timestamptz

company.sevdesk_contact_id    text UNIQUE NULL → sevdesk_contact.id ON DELETE SET NULL

invoice                       // Rechnungen, Stornos, Gutschriften
  id                  text PK   // SevDesk-ID: stabil, später Ziel von time_entry.invoice_id
  kind                text NOT NULL (InvoiceKind)
  number              text NULL // Entwürfe haben evtl. noch keine Nummer
  sevdesk_contact_id  text NULL → sevdesk_contact.id ON DELETE SET NULL
  contact_name        text NOT NULL  // Name auf der Rechnung, falls der Kontakt fehlt
  subject             text NULL      // Betreff/Header
  invoice_date        date NOT NULL
  due_date            date NULL
  paid_at             date NULL
  status              text NOT NULL (InvoiceStatus)
  currency            text NOT NULL  // ISO, z. B. EUR
  net_cents           integer NOT NULL   // Originalwährung, Stornos/Gutschriften negativ
  gross_cents         integer NOT NULL
  net_eur_cents       integer NOT NULL   // für Diagramm/KPIs
  gross_eur_cents     integer NOT NULL
  sevdesk_updated_at  timestamptz
  synced_at           timestamptz NOT NULL
  INDEX (invoice_date), INDEX (sevdesk_contact_id, invoice_date), INDEX (status)

sevdesk_sync_state            // eine Zeile (id = 'default')
  id text PK, last_synced_at timestamptz, last_error text NULL, updated_at
```

Beträge immer in Cent als Integer, wie bei den Projekten.

## Rollen & Zugriff

- `src/lib/auth/is-admin.ts` (`isAdmin(session)`) und `require-admin.ts` (wirft `notFound()`).
- `/finanzen/*`: Seiten und Server-Actions rufen `requireAdmin()` auf. Nicht-Admins bekommen 404.
- Sidebar und mobiles Menü bekommen die Rolle übergeben und blenden „Finanzen“ aus.
- Unternehmensseite und Dashboard laden SevDesk-Daten nur für Admins.
- Rolle setzen: einmalig per SQL (`update "user" set role = 'admin' where email = …`). Keine UI dafür.

## SevDesk-Anbindung — `src/lib/sevdesk/`

Jede Datei eine Funktion, alles `server-only`. Token aus `SEVDESK_API_TOKEN`.

- `sevdesk-fetch.ts`: Basis-Request (Auth-Header, JSON, Fehler mit Status)
- `list-sevdesk-invoices.ts`, `list-sevdesk-credit-notes.ts`, `list-sevdesk-contacts.ts`: paginiert, liefern alle Objekte
- `map-sevdesk-invoice.ts` / `map-sevdesk-credit-note.ts` / `map-sevdesk-contact.ts`: API-Objekt → Tabellenzeile (Status, Art, Vorzeichen, EUR-Umrechnung, Fälligkeit). **Tests.**
- `get-sevdesk-invoice-positions.ts`, `get-sevdesk-invoice-pdf.ts`: live für die Detailseite
- `get-sevdesk-invoice-url.ts`, `get-sevdesk-contact-url.ts`: Deep-Links
- `sync-sevdesk.ts`: holt Kontakte und Rechnungen, upsertet sie, löscht lokal, was in SevDesk nicht mehr existiert, schreibt `sevdesk_sync_state`. Schutz gegen parallele Läufe per Advisory-Lock, wie beim Kalender-Sync. Ein **Vollabgleich** pro Lauf ist bei einigen hundert Rechnungen günstig genug. Upsert über eine Funktion, die auch einzelne Rechnungen schreiben kann (wird später für „Entwurf aus Zeiteinträgen“ gebraucht).

Cron: `src/app/api/cron/sevdesk-sync/route.ts` (`isCronRequest`), in `apps/os/vercel.json` mit `0 * * * *`. Manueller Sync als Server-Action auf `/finanzen`.

Env: `SEVDESK_API_TOKEN` in `.env.example`, `.env.local`, Vercel (Production + Preview), und falls nötig in `apps/os/turbo.json`.

## DB-Funktionen — `src/lib/db/`

- `invoices/`: `upsert-invoices.ts`, `delete-invoices-except.ts`, `list-invoices.ts` (Tab, Jahr, optional Kontakt), `get-invoice.ts`, `get-monthly-revenue.ts` (Monatssummen `net_eur_cents` für einen Zeitraum, ohne Entwürfe, Monate ohne Rechnung = 0), `get-revenue-totals.ts` (Zeitraum-Summe, offen, überfällig; optional pro Kontakt)
- `sevdesk-contacts/`: `upsert-sevdesk-contacts.ts`, `list-sevdesk-contacts.ts` (für die Combobox, mit Anzahl Rechnungen), `count-unlinked-sevdesk-contacts.ts` (Kunden mit Rechnungen ohne Unternehmen)
- `companies/`: `link-company-sevdesk-contact.ts` / Verknüpfung lösen
- `sevdesk-sync-states/`: lesen/schreiben

## Finanz-Logik — `src/lib/finance/`

- `parse-revenue-range.ts`: `searchParams` → Zeitraum. Presets `12m` (Standard), `jahr`, `vorjahr`, `alles` sowie frei `von=2024-01&bis=2024-12`. **Tests.**
- `get-comparison-range.ts`: derselbe Zeitraum ein Jahr früher. Nur für Zeiträume bis 12 Monate. **Tests.**
- `is-invoice-overdue.ts`: offen/teilweise bezahlt und `due_date` < heute (Europe/Berlin). **Tests.**
- `suggest-sevdesk-contact.ts`: Namensvorschlag für ein Unternehmen. Normalisieren (Kleinschreibung, Rechtsformen wie GmbH/UG/AG/e.K./& Co. KG entfernen, Satzzeichen), exakter Treffer vor „enthält“. **Tests.**
- `format-money.ts` (in `src/lib/format/`): Cent + Währung → `1.234,56 €`

## UI

Diagramm: shadcn `chart` (Recharts) über `pnpm dlx shadcn@latest add chart` in `apps/os`. Danach `lucide-react`-Importe ersetzen. Für die Monatsauswahl im freien Zeitraum: zwei `Select` (Monat/Jahr) im Popover, kein Tagesdatum.

### Sidebar mit Unterpunkten

- `nav-items.ts`: optionale `children` pro Eintrag sowie Flag `adminOnly`. „Finanzen“ → `href: '/finanzen'`, `children: [{ href: '/finanzen/rechnungen', label: 'Rechnungen' }]`.
- Unterpunkte werden nur angezeigt, solange `pathname` mit `/finanzen` beginnt. Dafür bekommt die Sidebar eine kleine Client-Komponente mit `usePathname`. Gleiches Verhalten im mobilen Menü.

### `/finanzen` — Übersicht

- Kopf: Titel, Zeitraum-Wahl (Presets + „Benutzerdefiniert“), Toggle „Vorjahr vergleichen“ (nur bei Zeiträumen bis 12 Monate), „Zuletzt synchronisiert vor …“ + Button „Jetzt synchronisieren“, Fehlerhinweis aus `last_error`
- KPIs: Umsatz netto im Zeitraum · Ø pro Monat · Offen (Betrag + Anzahl, unabhängig vom Zeitraum) · Überfällig
- Diagramm: Monatsbalken netto EUR. Vorjahr optional als Linie. Tooltip mit Betrag und Anzahl Rechnungen. Klick auf einen Balken öffnet die Liste mit den Rechnungen dieses Monats (nice to have)
- `NoticeBar`: „N SevDesk-Kunden mit Rechnungen sind keinem Unternehmen zugeordnet“
- Zeitraum steckt in der URL (`?zeitraum=…`), damit er teilbar ist und der Zurück-Button funktioniert

### `/finanzen/rechnungen` — Liste

- Tabs: Alle · Entwürfe · Offen · Überfällig · Bezahlt (wie die Tabs der Zeiteinträge) + Jahresfilter (Standard: alle Jahre)
- Spalten: Nummer (Link zur Detailseite) · Kunde (Unternehmen mit Icon und Link, falls verknüpft, sonst SevDesk-Name) · Datum · Fällig · Netto (EUR; bei Fremdwährung zusätzlich klein der Originalbetrag) · Status-Pill (Entwurf/Offen/Teilweise/Bezahlt/Überfällig, Storno/Gutschrift als Art) · Aktionen PDF / SevDesk
- Tabellenstil wie die Projekte: keine Zeilenumbrüche, nur die wichtigen Spalten

### `/finanzen/rechnungen/[id]` — Detail

- `id` = SevDesk-ID, weil Entwürfe keine Nummer haben
- Kopf: Nummer/„Entwurf“, Kunde, Betreff, Status, Rechnungs-/Fälligkeits-/Zahlungsdatum, Netto/USt/Brutto, bei Fremdwährung der Originalbetrag und der Kurs
- Positionen live aus SevDesk (bei Fehler: Hinweis statt Absturz)
- Buttons: „PDF öffnen“ → Route-Handler `/finanzen/rechnungen/[id]/pdf` (admin-only, holt das PDF live und liefert es mit `Content-Disposition: inline`) · „In SevDesk öffnen“

### Unternehmensseite

Neuer Abschnitt „SevDesk“ (nur für Admins):

- nicht verknüpft: Combobox mit allen SevDesk-Kunden (Name + Kundennummer). Ein passender Vorschlag steht oben bzw. als Hinweis „Vorschlag: …“ mit Button „Verknüpfen“
- verknüpft: Kundennummer, Link „In SevDesk öffnen“, Button zum Ändern/Lösen. Umsatz netto gesamt + dieses Jahr, offener Betrag. Darunter die Rechnungen des Kunden (gleiche Tabelle wie die Liste, ohne Kunden-Spalte)
- ein SevDesk-Kunde gehört höchstens zu einem Unternehmen (`UNIQUE`). Ist er schon vergeben, zeigt die Combobox, zu welchem Unternehmen

### Dashboard

Kachel (nur Admins): Umsatz netto diesen Monat und dieses Jahr, offene Rechnungen (Anzahl + Betrag, davon überfällig), Link zu `/finanzen`.

## Später: Zeiteinträge → Rechnungsentwurf

Ziel: Beim Abrechnen von Zeiteinträgen wird direkt ein Rechnungsentwurf in SevDesk erstellt und geöffnet. Die Zeiteinträge sind dann mit dieser Rechnung verknüpft. **Jetzt nicht umsetzen.** Vorbereitet ist es durch:

- `invoice.id` = SevDesk-ID → später `time_entry.invoice_id` (FK, `ON DELETE SET NULL`) neben `billed_at`
- Unternehmen ↔ SevDesk-Kunde ist dann schon gepflegt, der Kunde für den Entwurf ist also bekannt
- Upsert einzelner Rechnungen im Sync, sodass der neue Entwurf ohne Vollsync sofort im OS steht
- Der Token muss dafür Schreibrechte haben (SevDesk-Tokens haben ohnehin Vollzugriff)

## Reihenfolge

1. Schritt 0 (API-Spike), Ergebnisse oben eintragen
2. Rolle am User + `requireAdmin`
3. Schema + Migration
4. `lib/sevdesk` + Mapping-Tests, Sync, Cron, manueller Sync
5. DB-Funktionen + `lib/finance` + Tests
6. Sidebar-Unterpunkte, `/finanzen`, `/finanzen/rechnungen`, Detail + PDF
7. Unternehmensseite: Verknüpfung, Umsatz, Rechnungen
8. Dashboard-Kachel
9. Typecheck, Lint, Tests, im Browser durchklicken
