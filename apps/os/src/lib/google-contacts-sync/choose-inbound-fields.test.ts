import { describe, expect, it } from 'vitest'
import { chooseInboundFields } from '@/lib/google-contacts-sync/choose-inbound-fields'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'

const fields = (firstName: string): SyncedContactFields => ({
  firstName,
  lastName: 'Lovelace',
  email: null,
  phone: null,
  whatsApp: null,
  birthday: null,
})

describe('chooseInboundFields', () => {
  it('picks the Google copy with the latest updateTime', () => {
    const chosen = chooseInboundFields({ syncedFieldsEditedAt: null, lastInboundAt: null }, [
      { updateTime: '2026-01-01T00:00:00Z', fields: fields('Old') },
      { updateTime: '2026-02-01T00:00:00Z', fields: fields('New') },
    ])
    expect(chosen?.firstName).toBe('New')
  })

  it('leaves the OS row alone after a newer OS edit', () => {
    expect(
      chooseInboundFields({ syncedFieldsEditedAt: new Date('2026-03-01T00:00:00Z'), lastInboundAt: new Date('2026-01-01T00:00:00Z') }, [
        { updateTime: '2026-04-01T00:00:00Z', fields: fields('Google') },
      ]),
    ).toBeNull()
  })

  it('does not blank a contact that Google returned without a name', () => {
    expect(
      chooseInboundFields({ syncedFieldsEditedAt: null, lastInboundAt: null }, [
        { updateTime: '2026-04-01T00:00:00Z', fields: { ...fields(''), lastName: '' } },
      ]),
    ).toBeNull()
  })
})
