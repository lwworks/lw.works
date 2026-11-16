import 'server-only'

import type { Invoice } from '@/lib/db/schema/finance'
import { sevdeskFetch } from '@/lib/sevdesk/sevdesk-fetch'

/**
 * The document's PDF as SevDesk renders it, fetched live. `preventSendBy=true` keeps SevDesk from marking the
 * invoice as sent, which a plain `getPdf` would do.
 */
export const getSevdeskPdf = async (document: Pick<Invoice, 'kind' | 'sevdeskId'>) => {
  const path = document.kind === 'credit_note' ? 'CreditNote' : 'Invoice'
  const response = await sevdeskFetch(`/${path}/${document.sevdeskId}/getPdf?download=false&preventSendBy=true`)
  return response.arrayBuffer()
}
