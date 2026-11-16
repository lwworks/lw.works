import 'server-only'

import { getSession } from '@/lib/auth/get-session'
import { isAdmin } from '@/lib/auth/is-admin'
import { notFound, redirect } from 'next/navigation'

/** The signed-in admin's user ID; redirects to the login page when signed out and 404s for everyone else. */
export const requireAdmin = async () => {
  const session = await getSession()
  if (!session) redirect('/login')
  if (!isAdmin(session)) notFound()
  return session.user.id
}
