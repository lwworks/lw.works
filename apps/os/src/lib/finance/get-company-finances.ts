import 'server-only'

import { getIsAdmin } from '@/lib/auth/get-is-admin'
import { getOutstandingInvoices } from '@/lib/db/invoices/get-outstanding-invoices'
import { getRevenueTotal } from '@/lib/db/invoices/get-revenue-total'
import { listInvoices } from '@/lib/db/invoices/list-invoices'
import { listSevdeskContacts } from '@/lib/db/sevdesk-contacts/list-sevdesk-contacts'
import { suggestSevdeskContact } from '@/lib/finance/suggest-sevdesk-contact'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'

/**
 * The company page's SevDesk section, or null for non-admins: the customer options (with a name-based suggestion
 * while unlinked) and, once linked, the customer's revenue and invoices.
 */
export const getCompanyFinances = async (company: { name: string; sevdeskContactId: string | null }) => {
  if (!(await getIsAdmin())) return null
  const today = toZonedDateKey(new Date())
  const contacts = await listSevdeskContacts()
  const customer = company.sevdeskContactId ? (contacts.find((contact) => contact.id === company.sevdeskContactId) ?? null) : null
  if (!customer) return { today, contacts, customer: null, suggestion: suggestSevdeskContact(company.name, contacts), linked: null }

  const year = today.slice(0, 4)
  const [totalNetEurCents, yearNetEurCents, outstanding, invoices] = await Promise.all([
    getRevenueTotal({ sevdeskContactId: customer.id }),
    getRevenueTotal({ sevdeskContactId: customer.id, from: `${year}-01`, to: `${year}-12` }),
    getOutstandingInvoices({ today, sevdeskContactId: customer.id }),
    listInvoices({ sevdeskContactId: customer.id, today }),
  ])
  return { today, contacts, customer, suggestion: null, linked: { totalNetEurCents, yearNetEurCents, outstanding, invoices } }
}

export type CompanyFinances = NonNullable<Awaited<ReturnType<typeof getCompanyFinances>>>
