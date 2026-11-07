import { ContactsPage } from '@/components/pages/contacts'
import { getSession } from '@/lib/auth/get-session'
import { proxiesThroughProduction } from '@/lib/auth/proxies-through-production'
import { listVisibleContacts } from '@/lib/db/contacts/list-visible-contacts'
import { getOwnGoogleAccount } from '@/lib/db/users/get-own-google-account'
import { hasContactsScope } from '@/lib/google-contacts-sync/has-contacts-scope'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = { title: 'Kontakte' }

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [contacts, google] = await Promise.all([
    listVisibleContacts(),
    getOwnGoogleAccount(),
  ])

  return (
    <ContactsPage
      contacts={contacts}
      needsContactsScope={!hasContactsScope(google?.scope ?? null)}
      proxied={proxiesThroughProduction()}
    />
  )
}
