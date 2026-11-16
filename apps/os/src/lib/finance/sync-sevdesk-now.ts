import 'server-only'

import { requireAdmin } from '@/lib/auth/require-admin'
import { syncSevdesk } from '@/lib/sevdesk/sync-sevdesk'

/** The "Jetzt synchronisieren" button: admins only. */
export const syncSevdeskNow = async () => {
  await requireAdmin()
  return syncSevdesk()
}
