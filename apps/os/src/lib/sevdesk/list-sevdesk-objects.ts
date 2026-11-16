import 'server-only'

import { sevdeskFetch } from '@/lib/sevdesk/sevdesk-fetch'

const PAGE_SIZE = 500

/** Every object of a SevDesk list endpoint (e.g. `/Invoice`), page by page. `query` is appended to each request. */
export const listSevdeskObjects = async <T>(path: string, query = '') => {
  const objects: T[] = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const response = await sevdeskFetch(`${path}?limit=${PAGE_SIZE}&offset=${offset}${query ? `&${query}` : ''}`)
    const page = ((await response.json()) as { objects: T[] }).objects
    objects.push(...page)
    if (page.length < PAGE_SIZE) return objects
  }
}
