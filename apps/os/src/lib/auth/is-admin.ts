import type { getSession } from '@/lib/auth/get-session'

type Session = Awaited<ReturnType<typeof getSession>>

/** Admins see finances. */
export const isAdmin = (session: Session) => session?.user.role === 'admin'
