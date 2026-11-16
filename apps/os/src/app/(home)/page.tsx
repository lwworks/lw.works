import { HomePage } from '@/components/pages/home'
import { getSession } from '@/lib/auth/get-session'
import { getDashboardFinances } from '@/lib/finance/get-dashboard-finances'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <HomePage finances={await getDashboardFinances()} />
  )
}
