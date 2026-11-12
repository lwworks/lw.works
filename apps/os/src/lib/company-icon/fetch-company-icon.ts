import 'server-only'

import { fetchImage, type FetchedImage } from '@/lib/company-icon/fetch-image'
import { findIconUrls } from '@/lib/company-icon/find-icon-urls'
import { toWebsiteUrl } from '@/lib/company-icon/to-website-url'

const maxHtmlBytes = 512 * 1024

/**
 * Loads the favicon of a company website: reads the icons the start page declares, then tries them best first
 * (falling back to `/favicon.ico`). Null when the website is missing, unreachable or declares nothing usable.
 */
export const fetchCompanyIcon = async (website: string | null): Promise<FetchedImage | null> => {
  const siteUrl = toWebsiteUrl(website)
  if (!siteUrl) return null

  let candidates: string[]
  try {
    const page = await fetch(siteUrl, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; lw.works OS favicon fetcher)', accept: 'text/html' },
      signal: AbortSignal.timeout(5000),
      cache: 'no-store',
    })
    const pageUrl = toWebsiteUrl(page.url) ?? siteUrl
    const html = page.ok && (page.headers.get('content-type') ?? '').includes('html') ? await readText(page) : ''
    candidates = findIconUrls(html, pageUrl)
  } catch {
    candidates = findIconUrls('', siteUrl)
  }

  for (const candidate of candidates.slice(0, 4)) {
    const icon = await fetchImage(candidate)
    if (icon) return icon
  }
  return null
}

const readText = async (response: Response) => {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let size = 0
  while (size < maxHtmlBytes) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.byteLength
  }
  await reader.cancel().catch(() => {})
  return new TextDecoder().decode(Buffer.concat(chunks))
}
