import { isInvoiceOverdue } from '@/lib/finance/is-invoice-overdue'
import { describe, expect, it } from 'vitest'

describe('isInvoiceOverdue', () => {
  it('is overdue only when open or partly paid and past the due date', () => {
    expect(isInvoiceOverdue({ status: 'open', dueDate: '2026-11-15' }, '2026-11-16')).toBe(true)
    expect(isInvoiceOverdue({ status: 'partially_paid', dueDate: '2026-11-15' }, '2026-11-16')).toBe(true)
    expect(isInvoiceOverdue({ status: 'open', dueDate: '2026-11-16' }, '2026-11-16')).toBe(false)
    expect(isInvoiceOverdue({ status: 'paid', dueDate: '2026-01-01' }, '2026-11-16')).toBe(false)
    expect(isInvoiceOverdue({ status: 'open', dueDate: null }, '2026-11-16')).toBe(false)
  })
})
