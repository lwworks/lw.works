import 'server-only'

import { detectImageType } from '@/lib/company-icon/detect-image-type'
import { toWebsiteUrl } from '@/lib/company-icon/to-website-url'

export type FetchedImage = { body: Uint8Array; contentType: string }

export const maxImageBytes = 512 * 1024

/** Downloads a public image (favicon, old logo URL). Null for internal hosts, errors, non-images and files over 512 KB. */
export const fetchImage = async (url: string): Promise<FetchedImage | null> => {
  if (!toWebsiteUrl(url)) return null
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; lw.works OS favicon fetcher)', accept: 'image/*,*/*;q=0.5' },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    if (!response.ok) return null
    if (Number(response.headers.get('content-length') ?? 0) > maxImageBytes) return null
    const body = new Uint8Array(await response.arrayBuffer())
    if (body.byteLength === 0 || body.byteLength > maxImageBytes) return null
    const contentType = detectImageType(body)
    return contentType ? { body, contentType } : null
  } catch {
    return null
  }
}
