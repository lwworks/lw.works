import 'server-only'

import { callPeopleApi } from '@/lib/google-contacts-sync/call-people-api'
import { googlePeopleRequest } from '@/lib/google-contacts-sync/google-people-request'

export const deleteGoogleContact = async (account: { accountId: string; userId: string }, resourceName: string) => {
  await callPeopleApi(account, (accessToken) => googlePeopleRequest(accessToken, `/${resourceName}:deleteContact`, { method: 'DELETE' }))
}
