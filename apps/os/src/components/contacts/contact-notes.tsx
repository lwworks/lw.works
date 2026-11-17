"use client"

import { addContactNoteAction } from "@/app/kontakte/actions"
import { NoteEditor } from "@/components/notes/note-editor"
import { toast } from "@lw/ui/components/sonner"
import { useTransition } from "react"

/** Composer for a new note on a contact. */
export const ContactNoteComposer = ({ displayId }: { displayId: number }) => {
  const [pending, startTransition] = useTransition()
  return (
    <NoteEditor
      variant="bare"
      placeholder="Notiz hinzufügen …"
      submitLabel="Speichern"
      pending={pending}
      onSubmit={(doc) =>
        new Promise((resolve) =>
          startTransition(async () => {
            const result = await addContactNoteAction(displayId, doc)
            if (!result.ok) toast.error(result.message)
            resolve(result.ok)
          }),
        )
      }
    />
  )
}
