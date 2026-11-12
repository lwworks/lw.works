import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { extractBusinessCard } from '@/lib/business-card/extract-business-card'
import { toContactPrefill, type ContactPrefill } from '@/lib/business-card/to-contact-prefill'
import { listCompanies } from '@/lib/db/companies/list-companies'

/** Reads an uploaded business card and turns it into values for the new-contact form. */
export const readBusinessCard = async (formData: FormData): Promise<{ ok: true; value: ContactPrefill } | { ok: false; message: string }> => {
  await requireUserId()
  const [card, companies] = await Promise.all([extractBusinessCard(formData), listCompanies()])
  if (!card.ok) return card
  return { ok: true, value: toContactPrefill(card.value, companies) }
}
