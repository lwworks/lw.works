"use client"

import { editNoteAction, removeNoteAction } from "@/app/notizen/actions"
import { ActorAvatar } from "@/components/activity/actor-avatar"
import { RelativeTime } from "@/components/activity/relative-time"
import { NoteContent } from "@/components/notes/note-content"
import { NoteEditor } from "@/components/notes/note-editor"
import type { NoteListItem } from "@/lib/db/notes/list-contact-notes"
import { formatDateTime } from "@/lib/format/format-date-time"
import { Button } from "@lw/ui/components/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@lw/ui/components/alert-dialog"
import { toast } from "@lw/ui/components/sonner"
import { Edit, Trash } from "@mynaui/icons-react"
import { useState, useTransition, type TransitionStartFunction } from "react"

/** Edits within a minute of creating don't count as "bearbeitet". */
const EDITED_THRESHOLD_MS = 60_000

/** One note in the timeline: author line like the other entries, content indented past the avatar; the author can edit it in place or delete it (with confirmation). */
export const NoteItem = ({ note }: { note: NoteListItem }) => {
  const [editing, setEditing] = useState(false)
  const [pending, startTransition] = useTransition()
  const edited = note.updatedAt.getTime() - note.createdAt.getTime() > EDITED_THRESHOLD_MS

  return (
    <article className="group">
      <header className="flex min-h-7 items-center justify-between gap-3 text-sm">
        <div className="flex min-w-0 items-center gap-2">
          <ActorAvatar name={note.authorName} image={note.authorImage} className="ring-2 ring-background" />
          <span className="truncate font-medium text-black dark:text-white">{note.authorName}</span>
          <RelativeTime date={note.createdAt} className="shrink-0" />
          {edited ? (
            <span className="shrink-0 text-neutral-400" title={`Bearbeitet am ${formatDateTime(note.updatedAt)}`}>
              (bearbeitet)
            </span>
          ) : null}
        </div>
        {note.canEdit && !editing ? (
          <div className="-mr-2 flex shrink-0 items-center text-neutral-400">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Notiz bearbeiten" title="Bearbeiten" disabled={pending} onClick={() => setEditing(true)}>
              <Edit strokeWidth={1.5} />
            </Button>
            <DeleteNoteButton noteId={note.id} pending={pending} startTransition={startTransition} />
          </div>
        ) : null}
      </header>
      {editing ? (
        <div className="pt-1 pl-7">
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
        <NoteContent doc={note.content} className="pl-7" />
      )}
    </article>
  )
}

const DeleteNoteButton = ({
  noteId,
  pending,
  startTransition,
}: {
  noteId: string
  pending: boolean
  startTransition: TransitionStartFunction
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Notiz löschen"
        title="Löschen"
        disabled={pending}
        className="hover:text-destructive"
      >
        <Trash strokeWidth={1.5} />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent size="sm">
      <AlertDialogHeader>
        <AlertDialogTitle>Notiz löschen?</AlertDialogTitle>
        <AlertDialogDescription>Die Notiz wird endgültig gelöscht.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Abbrechen</AlertDialogCancel>
        <AlertDialogAction
          variant="destructive"
          onClick={() =>
            startTransition(async () => {
              const result = await removeNoteAction(noteId)
              if (!result.ok) toast.error(result.message)
            })
          }
        >
          Löschen
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
