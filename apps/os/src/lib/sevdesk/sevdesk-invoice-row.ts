import type { Invoice } from '@/lib/db/schema/finance'

/** An `invoice` row as the sync writes it. */
export type SevdeskInvoiceRow = Omit<Invoice, 'syncedAt'>
