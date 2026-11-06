import 'server-only'

import { getAccessToken } from '@/lib/google-calendar/get-access-token'
import { GooglePeopleError } from '@/lib/google-contacts-sync/google-people-error'

/** Runs a People call and force-refreshes the token once after a 401. */
export const callPeopleApi = async <T>(account: { accountId: string; userId: string }, run: (accessToken: string) => Promise<T>) => {
  const accessToken = await getAccessToken(account)
  try {
    return await run(accessToken)
  } catch (error) {
    if (!(error instanceof GooglePeopleError) || error.status !== 401) throw error
    return run(await getAccessToken(account, true))
  }
}
