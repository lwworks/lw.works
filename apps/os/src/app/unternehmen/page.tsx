import { CompaniesPage } from '@/components/pages/companies'
import { getSession } from '@/lib/auth/get-session'
import { listCompanies } from '@/lib/db/companies/list-companies'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Unternehmen' }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')
  return <CompaniesPage companies={await listCompanies()} />
}
