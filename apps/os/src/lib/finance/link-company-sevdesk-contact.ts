import 'server-only'

import { setCompanySevdeskContact } from '@/lib/db/companies/set-company-sevdesk-contact'
import { postgresErrorCode } from '@/lib/db/postgres-error-code'
import { getSevdeskContact } from '@/lib/db/sevdesk-contacts/get-sevdesk-contact'

/** Links a company to a SevDesk customer (null unlinks). A customer belongs to at most one company. */
export const linkCompanySevdeskContact = async (companyId: string, sevdeskContactId: string | null) => {
  if (sevdeskContactId !== null && !(await getSevdeskContact(sevdeskContactId))) {
    return { ok: false as const, message: 'Diesen SevDesk-Kunden gibt es nicht mehr.' }
  }
  try {
    if (!(await setCompanySevdeskContact(companyId, sevdeskContactId))) return { ok: false as const, message: 'Unternehmen nicht gefunden.' }
  } catch (error) {
    if (postgresErrorCode(error) === '23505') return { ok: false as const, message: 'Dieser SevDesk-Kunde ist schon mit einem anderen Unternehmen verknüpft.' }
    throw error
  }
  return { ok: true as const }
}
