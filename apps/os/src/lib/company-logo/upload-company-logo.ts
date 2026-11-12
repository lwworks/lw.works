import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { readLogoUpload } from '@/lib/company-logo/read-logo-upload'
import { storeCompanyLogo } from '@/lib/company-logo/store-company-logo'
import { getStorage } from '@/lib/object-storage/get-storage'

/** Replaces the company's logo with an uploaded file. */
export const uploadCompanyLogo = async (companyId: string, formData: FormData) => {
  await requireUserId()
  const storage = getStorage()
  if (!storage) return { ok: false as const, message: 'Der Dateispeicher ist nicht eingerichtet.' }
  const upload = await readLogoUpload(formData.get('logo'))
  if (!upload.ok) return upload
  if (!(await storeCompanyLogo(storage, companyId, upload, 'upload'))) return { ok: false as const, message: 'Unternehmen wurde nicht gefunden.' }
  return { ok: true as const }
}
