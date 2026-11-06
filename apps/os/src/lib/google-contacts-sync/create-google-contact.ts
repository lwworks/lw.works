import 'server-only'

import { callPeopleApi } from '@/lib/google-contacts-sync/call-people-api'
import { googlePeopleRequest } from '@/lib/google-contacts-sync/google-people-request'
import type { GooglePerson } from '@/lib/google-contacts-sync/from-google-person'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { toGooglePerson } from '@/lib/google-contacts-sync/to-google-person'

/** Creates a contact. The body is only the synced fields. */
export const createGoogleContact = async (account: { accountId: string; userId: string }, fields: SyncedContactFields) =>
  callPeopleApi(
    account,
    (accessToken) =>
      googlePeopleRequest(accessToken, '/people:createContact', {
        method: 'POST',
        body: JSON.stringify(toGooglePerson(fields)),
      }) as Promise<GooglePerson>,
  )
