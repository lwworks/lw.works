import type { NoteListItem } from '@/lib/db/notes/list-notes'

export type TimelineActor = { name: string; image: string | null }

export type TimelineEvent = {
  kind: 'event'
  id: string
  at: Date
  type: 'created' | 'edited' | 'google_update'
  actor: TimelineActor | null
}

export type TimelineItem = { kind: 'note'; id: string; at: Date; note: NoteListItem } | TimelineEvent

/** Edits within this long after creating are part of creating the contact, not a separate event. */
const SAME_MOMENT_MS = 60_000

/**
 * A contact's notes and activity, newest first. Activity comes from the contact's own timestamps: created (with the
 * creator), last edited in the OS (`syncedFieldsEditedAt`, no actor stored) and last update from Google Contacts.
 */
export const buildContactTimeline = (
  contact: {
    createdAt: Date
    creator: TimelineActor
    syncedFieldsEditedAt: Date | null
    lastInboundAt: Date | null
  },
  notes: NoteListItem[],
): TimelineItem[] => {
  const after = (at: Date | null): at is Date => at !== null && at.getTime() - contact.createdAt.getTime() > SAME_MOMENT_MS
  const items: TimelineItem[] = [
    ...notes.map((note) => ({ kind: 'note' as const, id: note.id, at: note.createdAt, note })),
    { kind: 'event', id: 'created', at: contact.createdAt, type: 'created', actor: contact.creator },
  ]
  if (after(contact.syncedFieldsEditedAt)) {
    items.push({ kind: 'event', id: 'edited', at: contact.syncedFieldsEditedAt, type: 'edited', actor: null })
  }
  if (after(contact.lastInboundAt)) {
    items.push({ kind: 'event', id: 'google_update', at: contact.lastInboundAt, type: 'google_update', actor: null })
  }
  return items.sort((a, b) => b.at.getTime() - a.at.getTime())
}
