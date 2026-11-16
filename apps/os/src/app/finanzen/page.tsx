import { FinancesPage } from '@/components/pages/finances'
import { requireAdmin } from '@/lib/auth/require-admin'
import { getFinancesOverview } from '@/lib/finance/get-finances-overview'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Finanzen' }

export default async function Page({ searchParams }: PageProps<'/finanzen'>) {
  await requireAdmin()
  return <FinancesPage {...await getFinancesOverview(await searchParams)} />
}
