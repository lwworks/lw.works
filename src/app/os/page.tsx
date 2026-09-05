import { HomePage } from '@/components/os/pages/home'
import { getSession } from '@/lib/os/auth'
import { redirect } from 'next/navigation'

export default async function OsPage() {
  const session = await getSession()
  if (!session) redirect('/os/login')

  return (
    <HomePage />
  )
}
