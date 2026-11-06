import { describe, expect, it } from 'vitest'
import { inboundMayOverwrite } from '@/lib/google-contacts-sync/inbound-may-overwrite'

const earlier = new Date('2026-01-01T00:00:00Z')
const later = new Date('2026-01-02T00:00:00Z')

describe('inboundMayOverwrite', () => {
  it('is false when synced fields were edited in the OS after the last pull', () => {
    expect(inboundMayOverwrite({ syncedFieldsEditedAt: later, lastInboundAt: earlier })).toBe(false)
    expect(inboundMayOverwrite({ syncedFieldsEditedAt: later, lastInboundAt: null })).toBe(false)
  })

  it('is true when synced fields were not edited after the last pull', () => {
    expect(inboundMayOverwrite({ syncedFieldsEditedAt: null, lastInboundAt: null })).toBe(true)
    expect(inboundMayOverwrite({ syncedFieldsEditedAt: null, lastInboundAt: earlier })).toBe(true)
    expect(inboundMayOverwrite({ syncedFieldsEditedAt: earlier, lastInboundAt: later })).toBe(true)
    expect(inboundMayOverwrite({ syncedFieldsEditedAt: earlier, lastInboundAt: earlier })).toBe(true)
  })
})
