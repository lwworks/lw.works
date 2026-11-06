import 'server-only'

import { callPeopleApi } from '@/lib/google-contacts-sync/call-people-api'
import type { GooglePerson } from '@/lib/google-contacts-sync/from-google-person'
import { googlePeopleRequest } from '@/lib/google-contacts-sync/google-people-request'

/** Every contact in the signed-in user's address book. No sync token is stored. */
export const listGoogleConnections = async (account: { accountId: string; userId: string }) => {
  const people: GooglePerson[] = []
  let pageToken: string | undefined
  do {
    const search = new URLSearchParams({
      personFields: 'metadata,names,emailAddresses,phoneNumbers,birthdays',
      pageSize: '1000',
      sources: 'READ_SOURCE_TYPE_CONTACT',
    })
    if (pageToken) search.set('pageToken', pageToken)
    const page = (await callPeopleApi(account, (accessToken) => googlePeopleRequest(accessToken, `/people/me/connections?${search}`))) as {
      connections?: GooglePerson[]
      nextPageToken?: string
    } | null
    people.push(...(page?.connections ?? []))
    pageToken = page?.nextPageToken
  } while (pageToken)
  return people
}
