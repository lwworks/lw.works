import 'server-only'

import { listProjectContactOptions } from '@/lib/db/contacts/list-project-contact-options'

/** Every contact must be a non-private, live contact of the project's company. */
export const validateProjectContacts = async (companyId: string, contactIds: readonly string[]) => {
  const valid = await listProjectContactOptions({ companyId, ids: contactIds })
  return valid.length === contactIds.length
}
