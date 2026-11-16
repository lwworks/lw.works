import { mapSevdeskCreditNote } from '@/lib/sevdesk/map-sevdesk-credit-note'
import type { SevdeskCreditNoteObject } from '@/lib/sevdesk/types'
import { describe, expect, it } from 'vitest'

const creditNote: SevdeskCreditNoteObject = {
  id: '2357485',
  contact: { id: 'org-1', objectName: 'Contact' },
  update: '2025-10-14T19:17:33+02:00',
  header: 'Gutschrift zu R#25043',
  addressName: 'Georg Wallmann | Aplusia GmbH',
  status: '1000',
  currency: 'EUR',
  payDate: '2025-10-14T00:00:00+02:00',
  sumNet: '676',
  sumGross: '804.44',
  sumNetForeignCurrency: null,
  sumGrossForeignCurrency: null,
  creditNoteNumber: 'G#25001',
  creditNoteDate: '2025-10-14T00:00:00+02:00',
  refSrcInvoice: { id: '97163430', objectName: 'Invoice' },
}

describe('mapSevdeskCreditNote', () => {
  it('negates the amounts and prefixes the ID', () => {
    expect(mapSevdeskCreditNote(creditNote, new Map([['org-1', 'org-1']]))).toMatchObject({
      id: 'cn-2357485',
      sevdeskId: '2357485',
      kind: 'credit_note',
      number: 'G#25001',
      sevdeskContactId: 'org-1',
      invoiceDate: '2025-10-14',
      status: 'paid',
      originalInvoiceId: '97163430',
      netEurCents: -67600,
      grossEurCents: -80444,
      netCents: -67600,
    })
  })

  it('stays negative if SevDesk ever sends negative amounts', () => {
    expect(mapSevdeskCreditNote({ ...creditNote, sumNet: '-676' }, new Map())?.netEurCents).toBe(-67600)
  })
})
