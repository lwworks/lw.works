import { LoginPage } from '@/components/pages/login'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (session) redirect('/')

  return (
    <LoginPage />
  )
}
