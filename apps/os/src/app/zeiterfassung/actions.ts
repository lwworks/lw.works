'use server'

import { getSession } from '@/lib/auth/get-session'
import { syncCalendarForUser } from '@/lib/google-calendar/sync-calendar-for-user'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'

export async function syncOwnCalendar() {
  const session = await getSession()
  if (!session) redirect('/login')

  const result = await syncCalendarForUser(session.user.id)
  refresh()
  return result
}
