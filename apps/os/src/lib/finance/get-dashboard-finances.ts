import 'server-only'

import { getIsAdmin } from '@/lib/auth/get-is-admin'
import { getOutstandingInvoices } from '@/lib/db/invoices/get-outstanding-invoices'
import { getRevenueTotal } from '@/lib/db/invoices/get-revenue-total'
import { toZonedDateKey } from '@/lib/iso-week/to-zoned-date-key'

/** The dashboard's finance tile, or null for non-admins: net revenue this month and year, open invoices. */
export const getDashboardFinances = async () => {
  if (!(await getIsAdmin())) return null
  const today = toZonedDateKey(new Date())
  const month = today.slice(0, 7)
  const year = today.slice(0, 4)
  const [monthNetEurCents, yearNetEurCents, outstanding] = await Promise.all([
    getRevenueTotal({ from: month, to: month }),
    getRevenueTotal({ from: `${year}-01`, to: `${year}-12` }),
    getOutstandingInvoices({ today }),
  ])
  return { month, year, monthNetEurCents, yearNetEurCents, outstanding }
}

export type DashboardFinances = NonNullable<Awaited<ReturnType<typeof getDashboardFinances>>>
