import { CompanyPage } from '@/components/pages/company'
import { getSession } from '@/lib/auth/get-session'
import { getCompany } from '@/lib/db/companies/get-company'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Unternehmen' }

export default async function Page({ params }: PageProps<'/unternehmen/[companyId]'>) {
  const { companyId } = await params
  const session = await getSession()
  if (!session) redirect('/login')
  const company = await getCompany(companyId)
  if (!company) notFound()
  return <CompanyPage company={company} />
}
