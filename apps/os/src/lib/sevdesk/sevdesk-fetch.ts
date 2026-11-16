import 'server-only'

import { SevdeskError } from '@/lib/sevdesk/sevdesk-error'

const BASE_URL = 'https://my.sevdesk.de/api/v1'

/** GET against the SevDesk API v1 with the account's API token (`SEVDESK_API_TOKEN`). Throws `SevdeskError` unless 2xx. */
export const sevdeskFetch = async (path: string) => {
  const token = process.env.SEVDESK_API_TOKEN
  if (!token) throw new SevdeskError('SEVDESK_API_TOKEN fehlt.', 500)
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: token, Accept: 'application/json' },
    cache: 'no-store',
  })
  if (!response.ok) {
    throw new SevdeskError(`SevDesk antwortet mit ${response.status} auf ${path.split('?')[0]}.`, response.status)
  }
  return response
}
