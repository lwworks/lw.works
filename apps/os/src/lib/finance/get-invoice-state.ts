import type { Invoice } from '@/lib/db/schema/finance'
import { isInvoiceOverdue } from '@/lib/finance/is-invoice-overdue'

export type InvoiceStateTone = 'neutral' | 'muted' | 'open' | 'warning'

/** Label and tone of the status pill: the kind for cancellations and credit notes, else the (overdue-aware) status. */
export const getInvoiceState = (invoice: Pick<Invoice, 'kind' | 'status' | 'dueDate'>, today: string): { label: string; tone: InvoiceStateTone } => {
  if (invoice.status === 'draft') return { label: 'Entwurf', tone: 'muted' }
  if (invoice.kind === 'cancellation') return { label: 'Storno', tone: 'muted' }
  if (invoice.kind === 'credit_note') return { label: 'Gutschrift', tone: 'muted' }
  if (invoice.status === 'cancelled') return { label: 'Storniert', tone: 'muted' }
  if (isInvoiceOverdue(invoice, today)) return { label: 'Überfällig', tone: 'warning' }
  if (invoice.status === 'open') return { label: 'Offen', tone: 'open' }
  if (invoice.status === 'partially_paid') return { label: 'Teilweise bezahlt', tone: 'open' }
  return { label: 'Bezahlt', tone: 'neutral' }
}
