import 'server-only'

import { fetchCompanyIcon } from '@/lib/company-icon/fetch-company-icon'
import { fetchImage } from '@/lib/company-icon/fetch-image'
import { newLogoKey } from '@/lib/company-logo/new-logo-key'
import { claimCompanyLogoImport } from '@/lib/db/companies/claim-company-logo-import'
import { setImportedCompanyLogo } from '@/lib/db/companies/set-imported-company-logo'
import { deleteObject } from '@/lib/object-storage/delete-object'
import { getStorage } from '@/lib/object-storage/get-storage'
import { putObject } from '@/lib/object-storage/put-object'

/**
 * One-time logo import for a company that has none: the old manually entered logo URL if there is one, else the
 * website's favicon. Runs at most once per company (also when nothing was found), and never replaces an upload.
 * Returns the stored key, or null.
 */
export const importCompanyLogo = async (companyId: string) => {
  const storage = getStorage()
  if (!storage) return null
  const claim = await claimCompanyLogoImport(companyId)
  if (!claim) return null

  const legacy = claim.legacyLogoUrl ? await fetchImage(claim.legacyLogoUrl) : null
  const image = legacy ?? (await fetchCompanyIcon(claim.website))
  if (!image) return null

  const key = newLogoKey(companyId)
  await putObject(storage, key, image.body, image.contentType)
  if (!(await setImportedCompanyLogo(companyId, key, legacy ? 'legacy_url' : 'favicon'))) {
    await deleteObject(storage, key)
    return null
  }
  return key
}
