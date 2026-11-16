'use server'

import { syncSevdeskNow } from '@/lib/finance/sync-sevdesk-now'
import { refresh } from 'next/cache'

export async function syncSevdeskAction() {
  const result = await syncSevdeskNow()
  refresh()
  return result
}
