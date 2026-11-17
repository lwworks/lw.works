import { describe, expect, it } from 'vitest'
import { buildContactTimeline } from '@/lib/contacts/build-contact-timeline'
import type { NoteListItem } from '@/lib/db/notes/list-contact-notes'

const creator = { name: 'Lukas', image: null }
const note = (id: string, at: string): NoteListItem => ({
  id,
  content: { type: 'doc', content: [] },
  authorName: 'Lukas',
  authorImage: null,
  canEdit: true,
  createdAt: new Date(at),
  updatedAt: new Date(at),
})

describe('buildContactTimeline', () => {
  it('merges notes and activity, newest first', () => {
    const items = buildContactTimeline(
      {
        createdAt: new Date('2026-01-01T10:00:00Z'),
        creator,
        syncedFieldsEditedAt: new Date('2026-03-01T10:00:00Z'),
        lastInboundAt: new Date('2026-02-01T10:00:00Z'),
      },
      [note('n1', '2026-04-01T10:00:00Z'), note('n2', '2026-01-15T10:00:00Z')],
    )
    expect(items.map((item) => item.id)).toEqual(['n1', 'edited', 'google_update', 'n2', 'created'])
    expect(items.at(-1)).toMatchObject({ type: 'created', actor: creator })
  })

  it('skips edits made while creating the contact', () => {
    const items = buildContactTimeline(
      { createdAt: new Date('2026-01-01T10:00:00Z'), creator, syncedFieldsEditedAt: new Date('2026-01-01T10:00:20Z'), lastInboundAt: null },
      [],
    )
    expect(items.map((item) => item.id)).toEqual(['created'])
  })
})
