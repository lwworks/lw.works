import type { Invoice } from '@/lib/db/schema/finance'

/** Open or partly paid and past the due date. `today` is `YYYY-MM-DD` in Europe/Berlin. */
export const isInvoiceOverdue = (invoice: Pick<Invoice, 'status' | 'dueDate'>, today: string) =>
  (invoice.status === 'open' || invoice.status === 'partially_paid') && invoice.dueDate !== null && invoice.dueDate < today
