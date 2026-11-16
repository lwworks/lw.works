import 'server-only'

import { getSession } from '@/lib/auth/get-session'
import { isAdmin } from '@/lib/auth/is-admin'

/** Whether the signed-in user is an admin; false when signed out. */
export const getIsAdmin = async () => isAdmin(await getSession())
