import { getInvoiceState } from '@/lib/finance/get-invoice-state'
import { describe, expect, it } from 'vitest'

const today = '2026-11-16'

describe('getInvoiceState', () => {
  it.each([
    [{ kind: 'invoice', status: 'draft', dueDate: '2026-01-01' }, 'Entwurf'],
    [{ kind: 'invoice', status: 'open', dueDate: '2026-11-30' }, 'Offen'],
    [{ kind: 'invoice', status: 'open', dueDate: '2026-11-01' }, 'Überfällig'],
    [{ kind: 'invoice', status: 'partially_paid', dueDate: '2026-11-30' }, 'Teilweise bezahlt'],
    [{ kind: 'invoice', status: 'paid', dueDate: '2026-01-01' }, 'Bezahlt'],
    [{ kind: 'invoice', status: 'cancelled', dueDate: '2026-01-01' }, 'Storniert'],
    [{ kind: 'cancellation', status: 'paid', dueDate: null }, 'Storno'],
    [{ kind: 'credit_note', status: 'paid', dueDate: null }, 'Gutschrift'],
  ] as const)('%j → %s', (invoice, label) => {
    expect(getInvoiceState(invoice, today).label).toBe(label)
  })
})
