import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { fetchCompanyIcon } from '@/lib/company-icon/fetch-company-icon'
import { storeCompanyLogo } from '@/lib/company-logo/store-company-logo'
import { getCompanyLogoState } from '@/lib/db/companies/get-company-logo-state'
import { getStorage } from '@/lib/object-storage/get-storage'

/** Replaces the company's logo with the current favicon of its website (e.g. after an upload, or a new website). */
export const applyWebsiteFavicon = async (companyId: string) => {
  await requireUserId()
  const storage = getStorage()
  if (!storage) return { ok: false as const, message: 'Der Dateispeicher ist nicht eingerichtet.' }
  const state = await getCompanyLogoState(companyId)
  if (!state) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  if (!state.website) return { ok: false as const, message: 'Das Unternehmen hat keine Website.' }
  const icon = await fetchCompanyIcon(state.website)
  if (!icon) return { ok: false as const, message: 'Auf der Website wurde kein Favicon gefunden.' }
  if (!(await storeCompanyLogo(storage, companyId, icon, 'favicon'))) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  return { ok: true as const }
}
