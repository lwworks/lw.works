import { NewContactPage } from '@/components/pages/new-contact'
import { getSession } from '@/lib/auth/get-session'
import { listCompanies } from '@/lib/db/companies/list-companies'
import { listTags } from '@/lib/db/tags/list-tags'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Neuer Kontakt' }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [companies, tags] = await Promise.all([listCompanies(), listTags()])

  return <NewContactPage companies={companies} tags={tags} />
}
