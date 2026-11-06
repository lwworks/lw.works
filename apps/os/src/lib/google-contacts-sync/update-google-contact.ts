import 'server-only'

import { callPeopleApi } from '@/lib/google-contacts-sync/call-people-api'
import type { GooglePerson } from '@/lib/google-contacts-sync/from-google-person'
import { getGoogleContact } from '@/lib/google-contacts-sync/get-google-contact'
import { GooglePeopleError } from '@/lib/google-contacts-sync/google-people-error'
import { googlePeopleRequest } from '@/lib/google-contacts-sync/google-people-request'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { toGooglePerson } from '@/lib/google-contacts-sync/to-google-person'

const UPDATE_FIELDS = 'names,emailAddresses,phoneNumbers,birthdays'

/**
 * Updates synced fields. `etag` is People API concurrency metadata, not a contact field.
 * A stale etag is refreshed once.
 */
export const updateGoogleContact = async (
  account: { accountId: string; userId: string },
  resourceName: string,
  etag: string | null,
  fields: SyncedContactFields,
) => {
  const send = (currentEtag: string) =>
    callPeopleApi(
      account,
      (accessToken) =>
        googlePeopleRequest(accessToken, `/${resourceName}:updateContact?updatePersonFields=${UPDATE_FIELDS}`, {
          method: 'PATCH',
          body: JSON.stringify({ ...toGooglePerson(fields), etag: currentEtag }),
        }) as Promise<GooglePerson>,
    )

  const currentEtag = etag || (await getGoogleContact(account, resourceName)).etag || ''
  try {
    return await send(currentEtag)
  } catch (error) {
    if (!(error instanceof GooglePeopleError) || error.status !== 400) throw error
    const fresh = await getGoogleContact(account, resourceName)
    return send(fresh.etag || '')
  }
}
