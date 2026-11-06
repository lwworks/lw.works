import { ContactsPage } from '@/components/pages/contacts'
import { getSession } from '@/lib/auth/get-session'
import { proxiesThroughProduction } from '@/lib/auth/proxies-through-production'
import { listCompanies } from '@/lib/db/companies/list-companies'
import { listVisibleContacts } from '@/lib/db/contacts/list-visible-contacts'
import { listTags } from '@/lib/db/tags/list-tags'
import { getOwnGoogleAccount } from '@/lib/db/users/get-own-google-account'
import { hasContactsScope } from '@/lib/google-contacts-sync/has-contacts-scope'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Kontakte' }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [contacts, companies, tags, google] = await Promise.all([
    listVisibleContacts(),
    listCompanies(),
    listTags(),
    getOwnGoogleAccount(),
  ])

  return (
    <ContactsPage
      contacts={contacts}
      companies={companies}
      tags={tags}
      needsContactsScope={!hasContactsScope(google?.scope ?? null)}
      proxied={proxiesThroughProduction()}
    />
  )
}
