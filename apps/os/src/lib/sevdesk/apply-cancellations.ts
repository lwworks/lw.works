import type { SevdeskInvoiceRow } from '@/lib/sevdesk/sevdesk-invoice-row'

/** Marks every invoice a non-draft cancellation points to as `cancelled` (SevDesk leaves it at "paid"). */
export const applyCancellations = (rows: SevdeskInvoiceRow[]): SevdeskInvoiceRow[] => {
  const cancelledIds = new Set(
    rows.filter((row) => row.kind === 'cancellation' && row.status !== 'draft' && row.originalInvoiceId).map((row) => row.originalInvoiceId),
  )
  return rows.map((row) => (row.kind === 'invoice' && cancelledIds.has(row.id) ? { ...row, status: 'cancelled' as const } : row))
}
