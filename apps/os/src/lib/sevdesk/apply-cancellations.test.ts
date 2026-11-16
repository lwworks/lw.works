import { applyCancellations } from '@/lib/sevdesk/apply-cancellations'
import type { SevdeskInvoiceRow } from '@/lib/sevdesk/sevdesk-invoice-row'
import { describe, expect, it } from 'vitest'

const row = (values: Partial<SevdeskInvoiceRow>) => ({ id: 'x', kind: 'invoice', status: 'paid', originalInvoiceId: null, ...values }) as SevdeskInvoiceRow

describe('applyCancellations', () => {
  it('marks the invoice a cancellation points to as cancelled', () => {
    const rows = applyCancellations([row({ id: 'a' }), row({ id: 'b' }), row({ id: 's', kind: 'cancellation', originalInvoiceId: 'a' })])
    expect(rows.map((r) => r.status)).toEqual(['cancelled', 'paid', 'paid'])
  })

  it('ignores draft cancellations and credit notes', () => {
    const rows = applyCancellations([
      row({ id: 'a' }),
      row({ id: 's', kind: 'cancellation', status: 'draft', originalInvoiceId: 'a' }),
      row({ id: 'cn-1', kind: 'credit_note', originalInvoiceId: 'a' }),
    ])
    expect(rows[0].status).toBe('paid')
  })
})
