# Notizen

Formatierte Notizen an Kontakten, Unternehmen und Projekten. Erster Schritt: Kontakte.

## Datenmodell

Tabelle `note` (`apps/os/src/lib/db/schema/notes.ts`, Migration `0010_notes`):

- `content` (jsonb): Tiptap-Dokument, beschränkt auf Absätze, Zeilenumbrüche, Aufzählungen, nummerierte Listen (verschachtelbar), **fett**, *kursiv* und Links.
- `contact_id` / `company_id` / `project_id`: genau eins ist gesetzt (`CHECK num_nonnulls(...) = 1`), jeweils `ON DELETE CASCADE`.
- `created_by_user_id`, `created_at`, `updated_at`.

## Sicherheit

- `parseNoteDoc` baut jedes vom Client gesendete Dokument aus den erlaubten Knoten und Marks neu auf (unbekannte Knoten/Attribute fallen weg, max. 100 kB, max. Verschachtelung 8, leere Notizen werden abgelehnt).
- `safeNoteHref` lässt nur `http(s):`, `mailto:` und `tel:` zu; nackte Domains bekommen `https://`. Wird beim Speichern und beim Rendern geprüft.
- Notizen werden als React-Elemente gerendert (`NoteContent`), nie als HTML.
- Bearbeiten/Löschen nur durch den Autor (`getOwnNote`); Kontaktnotizen zusätzlich nur, solange der Kontakt sichtbar ist.

## UI

- `NoteEditor` (Tiptap 3, StarterKit ohne Überschriften, Code, Zitat, Durchstreichen, Unterstreichen, Linie): Toolbar Fett, Kursiv, Liste, nummerierte Liste, Link (Popover). ⌘/Strg+Enter speichert, Escape bricht ab. Markdown-Kürzel (`- `, `1. `, `**…**`) funktionieren.
- Kontaktseite: unter Details/Eigenschaften eine eigene Section mit dem Eingabefeld (volle Breite, rahmenlos, Border unten), darunter die Timeline ohne Titel im Linear-Stil: Notizen als Karten (Avatar, Autor, relative Zeit, „(bearbeitet)“, Menü beim Hover), Aktivitäten als einzeilige Einträge, verbunden durch eine senkrechte Linie. Neueste zuerst.
- Aktivitäten (`buildContactTimeline`) kommen vorerst aus den Zeitstempeln des Kontakts: angelegt (mit Ersteller), zuletzt bearbeitet (`synced_fields_edited_at`, ohne Person), aus Google Kontakte aktualisiert (`last_inbound_at`).

## Nächste Schritte

- Echtes Aktivitätsprotokoll (Tabelle `activity`: wer hat wann was geändert – Felder, Unternehmen, Tags, Privat), damit jede Änderung mit Person in der Timeline steht statt nur die letzte.

- Unternehmen und Projekte: `list-company-notes.ts` / `list-project-notes.ts`, `add-company-note.ts` / `add-project-note.ts`, Actions + Composer wie bei Kontakten. `NoteList`, `NoteItem`, `NoteEditor`, `editNoteAction`, `removeNoteAction` sind schon generisch.
