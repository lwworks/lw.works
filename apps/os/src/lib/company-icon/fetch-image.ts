import 'server-only'

import { detectImageType } from '@/lib/company-icon/detect-image-type'
import { safeGet } from '@/lib/company-icon/safe-get'

export type FetchedImage = { body: Uint8Array; contentType: string }

export const maxImageBytes = 512 * 1024

/** Downloads a public image (favicon, old logo URL) via `safeGet`. Null for errors, non-images and files over 512 KB. */
export const fetchImage = async (url: string): Promise<FetchedImage | null> => {
  const response = await safeGet(url, { accept: 'image/*,*/*;q=0.5', maxBytes: maxImageBytes })
  if (!response || response.status < 200 || response.status >= 300 || response.body.byteLength === 0) return null
  const contentType = detectImageType(response.body)
  return contentType ? { body: response.body, contentType } : null
}
