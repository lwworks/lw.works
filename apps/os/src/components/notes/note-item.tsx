"use client"

import { editNoteAction, removeNoteAction } from "@/app/notizen/actions"
import { NoteContent } from "@/components/notes/note-content"
import { NoteEditor } from "@/components/notes/note-editor"
import type { NoteListItem } from "@/lib/db/notes/list-contact-notes"
import { formatDateTime } from "@/lib/format/format-date-time"
import { Button } from "@lw/ui/components/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@lw/ui/components/dropdown-menu"
import { toast } from "@lw/ui/components/sonner"
import { DotsVertical, Edit, Trash } from "@mynaui/icons-react"
import { useState, useTransition } from "react"

/** Edits within a minute of creating don't count as "bearbeitet". */
const EDITED_THRESHOLD_MS = 60_000

/** One note with its date and author; the author can edit it in place or delete it. */
export const NoteItem = ({ note }: { note: NoteListItem }) => {
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()
  const edited = note.updatedAt.getTime() - note.createdAt.getTime() > EDITED_THRESHOLD_MS

  return (
    <article className="group flex flex-col gap-2 py-5">
      <header className="flex min-h-7 items-center justify-between gap-3 text-sm">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2">
          <time dateTime={note.createdAt.toISOString()} className="font-medium text-black dark:text-white">
            {formatDateTime(note.createdAt)}
          </time>
          <span className="truncate text-neutral-500">{note.authorName}</span>
          {edited ? (
            <span className="text-neutral-400" title={`Bearbeitet am ${formatDateTime(note.updatedAt)}`}>
              (bearbeitet)
            </span>
          ) : null}
        </div>
        {note.canEdit && !editing ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Notiz-Aktionen" disabled={pending}>
                <DotsVertical strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setEditing(true)}>
                <Edit strokeWidth={1.5} />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => {
                  if (!confirm("Notiz löschen?")) return
                  startTransition(async () => {
                    const result = await removeNoteAction(note.id)
                    if (!result.ok) toast.error(result.message)
                  })
                }}
              >
                <Trash strokeWidth={1.5} />
                Löschen
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </header>
      {editing ? (
        <NoteEditor
          initialContent={note.content}
          submitLabel="Speichern"
          pending={pending}
          autoFocus
          onCancel={() => setEditing(false)}
          onSubmit={(doc) =>
            new Promise((resolve) =>
              startTransition(async () => {
                const result = await editNoteAction(note.id, doc)
                if (!result.ok) {
                  toast.error(result.message)
                  return resolve(false)
                }
                setEditing(false)
                resolve(true)
              }),
            )
          }
        />
      ) : (
        <NoteContent doc={note.content} />
      )}
    </article>
  )
}
