import 'server-only'

import type { TimeEntryAttendee } from '@/db/time-tracking-schema'

const CALENDARS_URL = 'https://www.googleapis.com/calendar/v3/calendars'
const MAX_ATTEMPTS = 3

type EventTime = { date?: string; dateTime?: string; timeZone?: string }

export type GoogleEvent = {
  id: string
  status?: 'confirmed' | 'tentative' | 'cancelled'
  summary?: string
  description?: string
  location?: string
  start?: EventTime
  end?: EventTime
  recurringEventId?: string
  iCalUID?: string
  htmlLink?: string
  updated?: string
  transparency?: 'opaque' | 'transparent'
  eventType?: string
  attendees?: Partial<TimeEntryAttendee>[]
}

export type ListEventsParams = { timeMin?: Date; timeMax?: Date; updatedMin?: Date; showDeleted?: boolean }

export class GoogleCalendarError extends Error {
  constructor(
    readonly status: number,
    readonly reasons: string[],
    message: string,
  ) {
    super(message)
  }

  get isRateLimited() {
    return this.status === 429 || this.reasons.some((reason) => reason === 'rateLimitExceeded' || reason === 'userRateLimitExceeded')
  }

  get isMissingScope() {
    return this.status === 403 && this.reasons.some((reason) => reason === 'insufficientPermissions' || reason === 'ACCESS_TOKEN_SCOPE_INSUFFICIENT')
  }
}

type ErrorBody = { error?: { message?: string; errors?: { reason?: string }[]; details?: { reason?: string }[] } }

const fetchEventsPage = async (url: string, accessToken: string) => {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` }, cache: 'no-store' })
    if (response.ok) return (await response.json()) as { items?: GoogleEvent[]; nextPageToken?: string }

    const body = (await response.json().catch(() => null)) as ErrorBody | null
    const reasons = [...(body?.error?.errors ?? []), ...(body?.error?.details ?? [])].flatMap((item) => item.reason ?? [])
    const error = new GoogleCalendarError(response.status, reasons, body?.error?.message ?? `Google Calendar API responded with ${response.status}`)
    if (!error.isRateLimited || attempt === MAX_ATTEMPTS) throw error
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)))
  }
}

/** Pages through `events.list`; on a 401 the access token is force-refreshed once and the page retried. */
export const listEvents = async (
  getAccessToken: (forceRefresh: boolean) => Promise<string>,
  calendarId: string,
  params: ListEventsParams,
  onPage: (events: GoogleEvent[]) => Promise<void>,
) => {
  const search = new URLSearchParams({ singleEvents: 'true', maxResults: '2500' })
  for (const [key, value] of Object.entries(params)) search.set(key, value instanceof Date ? value.toISOString() : String(value))

  let accessToken = await getAccessToken(false)
  let refreshed = false
  for (;;) {
    const url = `${CALENDARS_URL}/${encodeURIComponent(calendarId)}/events?${search}`
    let page
    try {
      page = await fetchEventsPage(url, accessToken)
    } catch (error) {
      if (!(error instanceof GoogleCalendarError && error.status === 401) || refreshed) throw error
      accessToken = await getAccessToken(true)
      refreshed = true
      continue
    }
    await onPage(page.items ?? [])
    if (!page.nextPageToken) return
    search.set('pageToken', page.nextPageToken)
  }
}
