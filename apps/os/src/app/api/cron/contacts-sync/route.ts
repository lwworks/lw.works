import { isCronRequest } from '@/lib/auth/is-cron-request'
import { pullContacts } from '@/lib/google-contacts-sync/pull-contacts'
import { NextResponse } from 'next/server'

export const maxDuration = 300

export async function GET(request: Request) {
  if (!isCronRequest(request)) return new NextResponse('Unauthorized.', { status: 401 })

  const summary = await pullContacts()
  console.log('Contacts sync finished:', summary)
  return NextResponse.json({ ok: true, ...summary })
}
