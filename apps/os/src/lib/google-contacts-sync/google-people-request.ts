import 'server-only'

import { GooglePeopleError } from '@/lib/google-contacts-sync/google-people-error'

const PEOPLE_API = 'https://people.googleapis.com/v1'

type ErrorBody = { error?: { message?: string; status?: string; errors?: { reason?: string }[]; details?: { reason?: string }[] } }

/** One People API call. Retries a 429. The access token is a header and is never logged. */
export const googlePeopleRequest = async (accessToken: string, path: string, init?: { method?: string; body?: string }) => {
  for (let attempt = 1; ; attempt++) {
    const response = await fetch(`${PEOPLE_API}${path}`, {
      method: init?.method,
      body: init?.body,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      },
      cache: 'no-store',
    })
    if (response.ok) {
      if (response.status === 204) return null
      return response.json()
    }

    const body = (await response.json().catch(() => null)) as ErrorBody | null
    const reasons = [
      ...(body?.error?.errors ?? []).flatMap((item) => (item.reason ? [item.reason] : [])),
      ...(body?.error?.details ?? []).flatMap((item) => (item.reason ? [item.reason] : [])),
      ...(body?.error?.status ? [body.error.status] : []),
    ]
    const error = new GooglePeopleError(response.status, reasons, body?.error?.message ?? `People API responded with ${response.status}`)
    if (response.status !== 429 || attempt === 3) throw error
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** (attempt - 1)))
  }
}
