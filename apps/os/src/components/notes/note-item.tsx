"use client"

import { editNoteAction, removeNoteAction } from "@/app/notizen/actions"
import { ActorAvatar } from "@/components/activity/actor-avatar"
import { RelativeTime } from "@/components/activity/relative-time"
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

/** One note as a timeline card with author and date; the author can edit it in place or delete it. */
export const NoteItem = ({ note }: { note: NoteListItem }) => {
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()
  const edited = note.updatedAt.getTime() - note.createdAt.getTime() > EDITED_THRESHOLD_MS

  return (
    <article className="group rounded-lg border border-neutral-200 bg-background shadow-xs dark:border-neutral-800">
      <header className="flex min-h-7 items-center justify-between gap-3 px-4 pt-3 text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <ActorAvatar name={note.authorName} image={note.authorImage} />
          <span className="truncate font-medium text-black dark:text-white">{note.authorName}</span>
          <RelativeTime date={note.createdAt} className="shrink-0" />
          {edited ? (
            <span className="shrink-0 text-neutral-400" title={`Bearbeitet am ${formatDateTime(note.updatedAt)}`}>
              (bearbeitet)
            </span>
          ) : null}
        </div>
        {note.canEdit && !editing ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Notiz-Aktionen"
                disabled={pending}
                className="-mr-2 text-neutral-500 transition-opacity aria-expanded:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
              >
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
        <div className="p-3 pt-2">
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
        </div>
      ) : (
        <NoteContent doc={note.content} className="px-4 pt-1 pb-3" />
      )}
    </article>
  )
}
