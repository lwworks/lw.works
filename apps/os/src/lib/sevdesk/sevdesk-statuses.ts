import type { InvoiceStatus } from '@/lib/db/schema/finance'

/** SevDesk document status → OS status. Anything else (e.g. `50`, a deactivated recurring template) is skipped. */
export const SEVDESK_STATUSES: Record<string, InvoiceStatus> = { '100': 'draft', '200': 'open', '750': 'partially_paid', '1000': 'paid' }
