import 'server-only'

import { newLogoKey } from '@/lib/company-logo/new-logo-key'
import { replaceCompanyLogo } from '@/lib/db/companies/replace-company-logo'
import type { CompanyLogoSource } from '@/lib/db/schema/crm'
import { deleteObject } from '@/lib/object-storage/delete-object'
import type { Storage } from '@/lib/object-storage/get-storage'
import { putObject } from '@/lib/object-storage/put-object'

/** Uploads a logo, makes it the company's logo and deletes the one it replaces. False when the company is gone. */
export const storeCompanyLogo = async (
  storage: Storage,
  companyId: string,
  image: { body: Uint8Array; contentType: string },
  source: CompanyLogoSource,
) => {
  const key = newLogoKey(companyId)
  await putObject(storage, key, image.body, image.contentType)
  const previous = await replaceCompanyLogo(companyId, key, source)
  if (previous === undefined) {
    await deleteObject(storage, key)
    return false
  }
  if (previous) await deleteObject(storage, previous)
  return true
}
