import 'server-only'

const EVENTS_URL = 'https://www.googleapis.com/calendar/v3/calendars'
const MAX_RESULTS = 2500
const RATE_LIMIT_RETRIES = 3

export type GoogleEventDateTime = {
  date?: string
  dateTime?: string
  timeZone?: string
}

export type GoogleEventAttendee = {
  email?: string
  displayName?: string
  responseStatus?: string
  organizer?: boolean
  self?: boolean
  optional?: boolean
}

export type GoogleEvent = {
  id: string
  status?: 'confirmed' | 'tentative' | 'cancelled'
  summary?: string
  description?: string
  location?: string
  start?: GoogleEventDateTime
  end?: GoogleEventDateTime
  recurringEventId?: string
  iCalUID?: string
  htmlLink?: string
  updated?: string
  transparency?: 'opaque' | 'transparent'
  eventType?: string
  attendees?: GoogleEventAttendee[]
}

type EventsListResponse = {
  items?: GoogleEvent[]
  nextPageToken?: string
}

export type ListEventsParams = {
  timeMin?: Date
  timeMax?: Date
  updatedMin?: Date
  showDeleted?: boolean
}

export class GoogleCalendarError extends Error {
  constructor(
    readonly status: number,
    readonly reasons: string[],
    message: string,
  ) {
    super(message)
    this.name = 'GoogleCalendarError'
  }

  get isRateLimited() {
    return this.status === 429 || this.reasons.some((reason) => reason === 'rateLimitExceeded' || reason === 'userRateLimitExceeded')
  }

  get isMissingScope() {
    return this.status === 403 && this.reasons.some((reason) => reason === 'insufficientPermissions' || reason === 'ACCESS_TOKEN_SCOPE_INSUFFICIENT')
  }
}

const toGoogleCalendarError = async (response: Response) => {
  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string; errors?: { reason?: string }[]; details?: { reason?: string }[] }
  } | null
  const reasons = [...(body?.error?.errors ?? []), ...(body?.error?.details ?? [])]
    .map((item) => item.reason)
    .filter((reason): reason is string => Boolean(reason))
  return new GoogleCalendarError(response.status, reasons, body?.error?.message ?? `Google Calendar API responded with ${response.status}`)
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const fetchEventsPage = async (accessToken: string, calendarId: string, search: URLSearchParams) => {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(`${EVENTS_URL}/${encodeURIComponent(calendarId)}/events?${search}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    })
    if (response.ok) return (await response.json()) as EventsListResponse

    const error = await toGoogleCalendarError(response)
    if (!error.isRateLimited || attempt >= RATE_LIMIT_RETRIES) throw error
    await sleep(1000 * 2 ** attempt)
  }
}

export const listEvents = async (
  getAccessToken: (forceRefresh: boolean) => Promise<string>,
  calendarId: string,
  params: ListEventsParams,
  onPage: (events: GoogleEvent[]) => Promise<void>,
) => {
  const search = new URLSearchParams({ singleEvents: 'true', maxResults: String(MAX_RESULTS) })
  if (params.timeMin) search.set('timeMin', params.timeMin.toISOString())
  if (params.timeMax) search.set('timeMax', params.timeMax.toISOString())
  if (params.updatedMin) search.set('updatedMin', params.updatedMin.toISOString())
  if (params.showDeleted) search.set('showDeleted', 'true')

  let accessToken = await getAccessToken(false)
  let refreshed = false

  for (;;) {
    let page: EventsListResponse
    try {
      page = await fetchEventsPage(accessToken, calendarId, search)
    } catch (error) {
      if (error instanceof GoogleCalendarError && error.status === 401 && !refreshed) {
        accessToken = await getAccessToken(true)
        refreshed = true
        continue
      }
      throw error
    }

    await onPage(page.items ?? [])
    if (!page.nextPageToken) return
    search.set('pageToken', page.nextPageToken)
  }
}
