import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import type { Invoice } from '@/lib/db/schema/finance'
import { getSevdeskPositions } from '@/lib/sevdesk/get-sevdesk-positions'
import { SevdeskError } from '@/lib/sevdesk/sevdesk-error'

/** Line items live from SevDesk; an error result instead of a thrown error, so the detail page still renders. */
export const loadInvoicePositions = async (invoice: Pick<Invoice, 'kind' | 'sevdeskId' | 'currency'>) => {
  await requireAdmin()
  try {
    return { ok: true as const, positions: await getSevdeskPositions(invoice) }
  } catch (error) {
    console.error('SevDesk positions failed:', error instanceof SevdeskError ? error.message : error)
    return { ok: false as const, message: error instanceof SevdeskError ? error.message : 'SevDesk nicht erreichbar.' }
  }
}
