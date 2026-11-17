import { NoteItem } from "@/components/notes/note-item"
import type { NoteListItem } from "@/lib/db/notes/list-contact-notes"

export const NoteList = ({ notes }: { notes: NoteListItem[] }) => {
  if (notes.length === 0) return <p className="mt-6 text-sm text-neutral-500">Noch keine Notizen.</p>
  return (
    <div className="mt-2 flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </div>
  )
}
