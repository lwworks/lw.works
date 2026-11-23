"use client"

import { addContactNoteAction } from "@/app/kontakte/actions"
import { addProjectNoteAction } from "@/app/projekte/actions"
import { addCompanyNoteAction } from "@/app/unternehmen/actions"
import { NoteEditor } from "@/components/notes/note-editor"
import { toast } from "@lw/ui/components/sonner"
import { useTransition } from "react"

export type NoteTarget = { type: "contact"; displayId: number } | { type: "company"; id: string } | { type: "project"; id: string }

const addNote = (target: NoteTarget, doc: unknown) => {
  switch (target.type) {
    case "contact":
      return addContactNoteAction(target.displayId, doc)
    case "company":
      return addCompanyNoteAction(target.id, doc)
    case "project":
      return addProjectNoteAction(target.id, doc)
  }
}

/** Composer for a new note on a contact, company or project. */
export const NoteComposer = ({ target }: { target: NoteTarget }) => {
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
            const result = await addNote(target, doc)
            if (!result.ok) toast.error(result.message)
            resolve(result.ok)
          }),
        )
      }
    />
  )
}
