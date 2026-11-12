import 'server-only'

import { fetchImage, type FetchedImage } from '@/lib/company-icon/fetch-image'
import { findIconUrls } from '@/lib/company-icon/find-icon-urls'
import { safeGet } from '@/lib/company-icon/safe-get'
import { toWebsiteUrl } from '@/lib/company-icon/to-website-url'

const maxHtmlBytes = 512 * 1024

/**
 * Loads the favicon of a company website: reads the icons the start page declares, then tries them best first
 * (falling back to `/favicon.ico`). All requests go through `safeGet` (no internal hosts). Null when the website is
 * missing, unreachable or declares nothing usable.
 */
export const fetchCompanyIcon = async (website: string | null): Promise<FetchedImage | null> => {
  const siteUrl = toWebsiteUrl(website)
  if (!siteUrl) return null

  const page = await safeGet(siteUrl, { accept: 'text/html', maxBytes: maxHtmlBytes, truncate: true })
  const html =
    page && page.status >= 200 && page.status < 300 && page.contentType.includes('html') ? new TextDecoder().decode(page.body) : ''
  const candidates = findIconUrls(html, page?.url ?? siteUrl)

  for (const candidate of candidates.slice(0, 4)) {
    const icon = await fetchImage(candidate)
    if (icon) return icon
  }
  return null
}
