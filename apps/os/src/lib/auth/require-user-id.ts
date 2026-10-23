import 'server-only'

import { getSession } from '@/lib/auth/get-session'
import { redirect } from 'next/navigation'

/** The signed-in user's ID; redirects to the login page otherwise. */
export const requireUserId = async () => {
  const session = await getSession()
  if (!session) redirect('/login')
  return session.user.id
}
