import { NewProjectPage } from '@/components/pages/new-project'
import { getSession } from '@/lib/auth/get-session'
import { listCompanies } from '@/lib/db/companies/list-companies'
import { listProjectContactOptions } from '@/lib/db/contacts/list-project-contact-options'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Neues Projekt' }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')
  const [companies, contactOptions] = await Promise.all([listCompanies(), listProjectContactOptions()])
  return <NewProjectPage companies={companies.map(({ id, name }) => ({ id, name }))} contactOptions={contactOptions} />
}
