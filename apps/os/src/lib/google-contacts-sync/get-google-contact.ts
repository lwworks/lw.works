import 'server-only'

import { callPeopleApi } from '@/lib/google-contacts-sync/call-people-api'
import type { GooglePerson } from '@/lib/google-contacts-sync/from-google-person'
import { googlePeopleRequest } from '@/lib/google-contacts-sync/google-people-request'

export const getGoogleContact = async (account: { accountId: string; userId: string }, resourceName: string) =>
  callPeopleApi(
    account,
    (accessToken) =>
      googlePeopleRequest(accessToken, `/${resourceName}?personFields=metadata`) as Promise<GooglePerson>,
  )
