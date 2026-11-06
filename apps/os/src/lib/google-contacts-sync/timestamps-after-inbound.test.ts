import { describe, expect, it } from 'vitest'
import { timestampsAfterInbound } from '@/lib/google-contacts-sync/timestamps-after-inbound'

describe('timestampsAfterInbound', () => {
  it('does not count a pull-applied write as an OS edit', () => {
    const syncedFieldsEditedAt = new Date('2026-01-02T00:00:00Z')
    const at = new Date('2026-01-03T03:00:00Z')

    expect(timestampsAfterInbound({ syncedFieldsEditedAt }, at)).toEqual({ syncedFieldsEditedAt, lastInboundAt: at })
    expect(timestampsAfterInbound({ syncedFieldsEditedAt: null }, at)).toEqual({
      syncedFieldsEditedAt: null,
      lastInboundAt: at,
    })
  })
})