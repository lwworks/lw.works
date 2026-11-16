import 'server-only'

import type { Invoice } from '@/lib/db/schema/finance'
import { sevdeskFetch } from '@/lib/sevdesk/sevdesk-fetch'
import { toCents } from '@/lib/sevdesk/to-cents'
import type { SevdeskPositionObject } from '@/lib/sevdesk/types'

/**
 * Line items of an invoice or credit note, fetched live (not stored). Amounts in cents in the document's currency;
 * credit notes stay positive here, as printed.
 */
export const getSevdeskPositions = async (document: Pick<Invoice, 'kind' | 'sevdeskId' | 'currency'>) => {
  const path = document.kind === 'credit_note' ? 'CreditNote' : 'Invoice'
  const response = await sevdeskFetch(`/${path}/${document.sevdeskId}/getPositions?limit=500`)
  const objects = ((await response.json()) as { objects: SevdeskPositionObject[] }).objects
  const isForeign = document.currency !== 'EUR'
  return objects
    .toSorted((a, b) => Number(a.positionNumber ?? 0) - Number(b.positionNumber ?? 0))
    .map((position) => {
      const quantity = Number.parseFloat(position.quantity)
      const netCents = isForeign ? toCents(position.sumNetForeignCurrency) : toCents(position.sumNet)
      return {
        id: position.id,
        name: position.name?.trim() || 'Position',
        text: position.text?.trim() || null,
        quantity: Number.isFinite(quantity) ? quantity : 0,
        // SevDesk's `priceNet` is in the document currency.
        unitNetCents: toCents(position.priceNet),
        netCents,
        taxRate: Number.parseFloat(position.taxRate ?? '0') || 0,
      }
    })
}

export type SevdeskPosition = Awaited<ReturnType<typeof getSevdeskPositions>>[number]
