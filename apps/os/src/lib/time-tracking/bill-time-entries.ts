import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getProjectMeta } from '@/lib/db/projects/get-project-meta'
import { setProjectTimeEntriesBilling } from '@/lib/db/time-entries/set-project-time-entries-billing'

const MAX_INVOICE_NUMBER_LENGTH = 100

/** Marks the project's selected entries (of all users) as billed on the invoice `invoiceNumber` (optional), or back to open with `billed: false`. */
export const billTimeEntries = async ({
  projectId,
  ids,
  billed,
  invoiceNumber,
}: {
  projectId: string
  ids: string[]
  billed: boolean
  invoiceNumber?: string
}) => {
  await requireUserId()
  const project = await getProjectMeta(projectId)
  if (!project) return { ok: false as const, message: 'Projekt wurde nicht gefunden.' }
  const number = invoiceNumber?.trim() || null
  if (number && number.length > MAX_INVOICE_NUMBER_LENGTH) return { ok: false as const, message: 'Die Rechnungsnummer ist zu lang.' }
  const count = await setProjectTimeEntriesBilling(projectId, ids, billed ? { billedAt: new Date(), invoiceNumber: number } : null)
  return { ok: true as const, count }
}
