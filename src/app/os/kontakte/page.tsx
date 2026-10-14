import { ContactsPage } from '@/components/os/pages/contacts'
import { getSession } from '@/lib/os/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/os/login')

  return (
    <ContactsPage />
  )
}
