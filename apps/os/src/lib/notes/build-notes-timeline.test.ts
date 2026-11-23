import { describe, expect, it } from 'vitest'
import type { NoteListItem } from '@/lib/db/notes/list-notes'
import { buildNotesTimeline } from '@/lib/notes/build-notes-timeline'

const note = (id: string, at: string): NoteListItem => ({
  id,
  content: { type: 'doc', content: [] },
  authorName: 'Lukas',
  authorImage: null,
  canEdit: true,
  createdAt: new Date(at),
  updatedAt: new Date(at),
})

describe('buildNotesTimeline', () => {
  it('puts notes before the creation entry, newest first', () => {
    const items = buildNotesTimeline(new Date('2026-01-01T10:00:00Z'), [note('n1', '2026-02-01T10:00:00Z'), note('n2', '2026-03-01T10:00:00Z')])
    expect(items.map((item) => item.id)).toEqual(['n2', 'n1', 'created'])
    expect(items.at(-1)).toMatchObject({ kind: 'event', type: 'created', actor: null })
  })

  it('shows only the creation entry without notes', () => {
    expect(buildNotesTimeline(new Date('2026-01-01T10:00:00Z'), [])).toHaveLength(1)
  })
})
