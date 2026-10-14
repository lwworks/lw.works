import { ContactPage } from '@/components/os/pages/contact'
import { getSession } from '@/lib/os/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/os/login')

  return (
    <ContactPage />
  )
}
