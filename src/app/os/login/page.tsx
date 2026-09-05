import { LoginPage } from '@/components/os/pages/login'
import { getSession } from '@/lib/os/auth'
import { redirect } from 'next/navigation'

export default async function OsLoginPage() {
  const session = await getSession()
  if (session) redirect('/os')

  return (
    <LoginPage />
  )
}
