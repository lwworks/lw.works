import type { TimelineItem } from '@/lib/contacts/build-contact-timeline'
import type { NoteListItem } from '@/lib/db/notes/list-notes'

/**
 * A company's or project's notes plus when it was created, newest first. Companies and projects don't store their
 * creator, so the "created" entry has no actor.
 */
export const buildNotesTimeline = (createdAt: Date, notes: NoteListItem[]): TimelineItem[] =>
  [
    ...notes.map((note) => ({ kind: 'note' as const, id: note.id, at: note.createdAt, note })),
    { kind: 'event' as const, id: 'created', at: createdAt, type: 'created' as const, actor: null },
  ].sort((a, b) => b.at.getTime() - a.at.getTime())
