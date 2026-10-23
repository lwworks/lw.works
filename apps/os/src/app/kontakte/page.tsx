import { ContactsPage } from '@/components/pages/contacts'
import { getSession } from '@/lib/auth/get-session'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <ContactsPage />
  )
}
