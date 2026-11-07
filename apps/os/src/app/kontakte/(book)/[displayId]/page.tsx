import { ContactPage } from '@/components/pages/contact'
import { getSession } from '@/lib/auth/get-session'
import { parseDisplayId } from '@/lib/contacts/parse-display-id'
import { listCompanies } from '@/lib/db/companies/list-companies'
import { getVisibleContact } from '@/lib/db/contacts/get-visible-contact'
import { listTags } from '@/lib/db/tags/list-tags'
import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Kontakt' }

export default async function Page({ params }: PageProps<'/kontakte/[displayId]'>) {
  const { displayId: raw } = await params
  const displayId = parseDisplayId(raw)
  if (displayId === null) notFound()

  const session = await getSession()
  if (!session) redirect('/login')

  const [contact, companies, tags] = await Promise.all([getVisibleContact(displayId), listCompanies(), listTags()])
  if (!contact) notFound()

  return <ContactPage contact={contact} companies={companies} tags={tags} />
}
