# Projekte

Status: **Implementiert** auf Branch `projekte` (Migration noch nicht ausgeführt).

## Ziel

Neues Konzept **Projekt** in `apps/os`:

- gehört zu genau einem Unternehmen (dem Kunden; jedes Unternehmen darf Kunde sein). Der Kunde wird beim Anlegen gewählt und ist danach fest
- hat mindestens einen Ansprechpartner: nicht-private Kontakte genau dieses Unternehmens
- hat ein Kürzel (Linear-artig), einen Titel, eine Beschreibung, einen Status und optional ein Start- und Enddatum
- wird nach Stunden, zum Festpreis oder als Retainer abgerechnet, jeweils mit den Details

Zunächst werden Projekte nur mit **Zeiteinträgen** verknüpft: automatisch über `KÜRZEL:` am Anfang des Kalendertitels und manuell über die Mehrfachauswahl in der Zeiterfassung.

## Begriffe

- **Kürzel** (`key` im Code), z. B. `BR`. Es wird beim Anlegen festgelegt und kann **danach nicht mehr geändert werden**. Es steht **nicht** in der URL. Wird das Projekt archiviert, ist das Kürzel wieder frei.
- **Slug** (`slug`): wird aus dem Titel erzeugt und in der URL verwendet, z. B. `/projekte/website-relaunch`.
- **Interne ID** (`id`): eine UUID wie bei Unternehmen.

## Datenmodell

Neue Datei `src/lib/db/schema/projects.ts` (Export über `schema/index.ts`) und eine Migration `0004_projects.sql` über `pnpm db:generate`.

```ts
export type ProjectBilling = 'hourly' | 'fixed' | 'retainer'
export type ProjectStatus  = 'planning' | 'active' | 'completed'   // Planung · Laufend · Abgeschlossen

project
  id                    text pk
  key                   text not null                -- "BR", unveränderlich; unique nur unter nicht archivierten Projekten
  slug                  text not null, unique        -- aus dem Titel
  title                 text not null
  description           text
  status                text not null default 'planning'
  startDate             date                          -- optional
  endDate               date                          -- optional, check: endDate >= startDate
  companyId             text not null → company.id (on delete restrict), nach dem Anlegen unveränderlich
  billing               text not null
  hourlyRateCents       integer   -- nur bei hourly
  fixedPriceCents       integer   -- nur bei fixed
  retainerAmountCents   integer   -- nur bei retainer (pro Monat)
  retainerHours         integer   -- nur bei retainer (Stundenkontingent pro Monat)
  archivedAt            timestamptz                   -- Soft-Delete („Archivieren“)
  createdAt / updatedAt

  partial unique index (key) where archived_at is null
  check: key ~ '^[A-Z][A-Z0-9]{1,5}$'
  check: die Felder der gewählten Abrechnungsart sind gesetzt, die übrigen sind null

project_contact                    -- n:m, Ansprechpartner
  projectId → project.id (cascade), contactId → contact.id (cascade), pk(projectId, contactId)

time_entry (neue Spalten)
  projectId          text → project.id (on delete set null), index
  projectAssignment  text  'auto' | 'manual' | null
```

- Beträge werden als Cent-Integer in EUR gespeichert, netto. Retainer-Betrag und Stundenkontingent gelten immer pro Monat. In der UI erscheinen sie als Euro.
- Projekte sind für alle Nutzer geteilt.
- `on delete restrict` am Unternehmen, auch bei archivierten Projekten: `removeCompany` meldet „Unternehmen hat Projekte“ als Formularfehler.
- **Validierung der Ansprechpartner** (`parse-project-input.ts` + Server-Check): mindestens einer. Jeder muss `companyId = project.companyId` haben, nicht privat und nicht gelöscht sein. Beim Anlegen leert ein Wechsel des Unternehmens die Auswahl der Ansprechpartner. Beim Bearbeiten ist das Unternehmen nur lesbar.
- Wird ein Kontakt später privat, gelöscht oder einem anderen Unternehmen zugeordnet, bleibt die Verknüpfung bestehen. Angezeigt werden aber nur Kontakte, die über `visibleContactWhere` sichtbar sind. Beim nächsten Speichern des Projekts wird erneut validiert.

## Slug

`slugify(title)` (Umlaute ausgeschrieben, Kleinbuchstaben, sonst `-`). Folgt dem Titel. Zwei Projekte mit gleichem Titel gibt es nicht (Fehlermeldung).

## Automatische Zuordnung über `KÜRZEL:`

`src/lib/projects/parse-project-key.ts` (reine Funktion, mit Test):

```ts
parseProjectKey('BR: Abstimmung Relaunch') // → { key: 'BR', rest: 'Abstimmung Relaunch' }
parseProjectKey('BR:Abstimmung')           // → { key: 'BR', rest: 'Abstimmung' }
parseProjectKey('BR Abstimmung')           // → null  (kein Doppelpunkt)
parseProjectKey('[BR] Abstimmung')         // → null
parseProjectKey('br: Abstimmung')          // → null  (nicht großgeschrieben)
```

Regex: `^([A-Z][A-Z0-9]{1,5}):\s*(.*)$`. Ein Treffer zählt nur, wenn es ein **nicht archiviertes** Projekt mit diesem Kürzel gibt. Der Status spielt dabei keine Rolle, Einträge zu abgeschlossenen Projekten werden also auch zugeordnet. Archivierte Projekte werden nie automatisch zugeordnet.

1. **Beim Sync:** `syncCalendarState` lädt einmal pro Lauf eine Map von Kürzel zu Projekt-ID. `upsertTimeEntries` setzt dann `projectId` und `projectAssignment = 'auto'`. Ist eine Zuordnung `manual`, wird sie nicht überschrieben (`CASE` im `onConflictDoUpdate`). Hat der Titel kein passendes Kürzel mehr, entfällt eine bisherige Auto-Zuordnung.
2. **Beim Anlegen eines Projekts:** `reassign-project-key.ts` ordnet alle bestehenden Einträge aller Nutzer zu, deren Titel mit `KEY:` beginnt und die nicht `manual` sind. Das ist ein einzelnes SQL-Update. Weil das Kürzel unveränderlich ist, reicht dieser eine Zeitpunkt.

## Archivieren

Es gibt kein Löschen, nur **Archivieren** (`archivedAt`). In einer Transaktion passiert dabei Folgendes:

1. `archivedAt = now()`. Damit ist das Kürzel wieder frei.
2. Alle Einträge mit `projectId = <projekt>` und `projectAssignment = 'auto'` werden auf `manual` gesetzt. So behalten sie ihre Zuordnung zum archivierten Projekt (Historie bleibt). Der Sync überschreibt sie nicht, und ein neues Projekt mit demselben Kürzel übernimmt sie nicht.

Einträge, die später mit `BR:` hinzukommen, bleiben ohne Projekt, bis wieder ein aktives Projekt `BR` existiert.

Auswirkungen auf die Oberfläche:
- Archivierte Projekte erscheinen nicht in der Projektliste (Filter „Archiviert“), nicht in der Combobox für die manuelle Zuordnung und nicht auf der Unternehmensseite. Ihre Detailseite ist weiter erreichbar und nur lesbar, mit Hinweis „Archiviert“.
- **Wiederherstellen** ist möglich, solange das Kürzel nicht wieder vergeben ist. Andernfalls erscheint eine Fehlermeldung. Die Zuordnungen, die beim Archivieren auf `manual` gesetzt wurden, bleiben `manual`.

`time_entry.title` bleibt der unveränderte Kalendertitel. Die Tabelle zeigt das **Projekt-Badge** (Kürzel) und daneben den Titel ohne Präfix.

## Manuelle Zuordnung (Mehrfachauswahl)

Bei ausgewählten Einträgen erscheint unten eine Leiste mit einem Select: Projekt (in Planung oder laufend) oder „Ohne Projekt“. Beides setzt `projectAssignment = 'manual'`; der Sync ändert das nicht mehr.

## UI

- **Sidebar:** „Projekte“ → `/projekte`.
- **`/projekte`:** Tabelle mit Kürzel-Badge, Titel, Kunde, Status, Abrechnungsart, Zeitraum und Stunden gesamt (alle Nutzer). Button „Neues Projekt“.
- **`/projekte/neu`:** Formular mit
  - Titel und Kürzel (nur hier editierbar; Hinweis, dass es danach fest ist)
  - Kunde (Combobox, nur beim Anlegen) und Ansprechpartner (Mehrfachauswahl, nur nicht-private Kontakte des gewählten Kunden)
  - Status (Select), Start/Ende (Date Picker)
  - Abrechnungsart (Radio Group) mit den passenden Feldern: Stundensatz, Festpreis oder Retainer-Betrag/Monat + Stunden/Monat
  - Beschreibung (Textarea)
- **`/projekte/[slug]`:** dieselben Felder wie beim Anlegen, Kürzel und Kunde nur lesbar. Außerdem Stunden gesamt (alle Nutzer), die letzten Zeiteinträge (mit Nutzer) und ein Button „Archivieren“ bzw. „Wiederherstellen“.
- **Unternehmensseite:** Liste der Projekte des Unternehmens.
- **Zeiterfassung:** Projekt-Badge in der Zeile und die Aktionsleiste für die Mehrfachauswahl.
