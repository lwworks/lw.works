type Candidate = { url: string; score: number }

/**
 * Icon URLs declared in a page's `<link rel="…icon…">` tags, best first, followed by `/favicon.ico` as the last resort.
 * Order: SVG icons, then PNG/ICO icons by declared size (largest first), then apple-touch-icons. `mask-icon` is skipped
 * (it's a monochrome Safari pinned-tab shape). Dark-mode variants rank after the light ones.
 */
export const findIconUrls = (html: string, pageUrl: URL): string[] => {
  const candidates: Candidate[] = []
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = readAttributes(tag)
    const rel = (attributes.rel ?? '').toLowerCase().split(/\s+/)
    const href = attributes.href
    if (!href || rel.includes('mask-icon')) continue
    const isIcon = rel.includes('icon')
    const isTouch = rel.includes('apple-touch-icon') || rel.includes('apple-touch-icon-precomposed')
    if (!isIcon && !isTouch) continue

    let url: URL
    try {
      url = new URL(href, pageUrl)
    } catch {
      continue
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') continue

    const type = (attributes.type ?? '').toLowerCase()
    const isSvg = type === 'image/svg+xml' || url.pathname.toLowerCase().endsWith('.svg')
    const size = largestSize(attributes.sizes)
    // Higher is better; touch icons rank below regular icons (they often carry a background and padding).
    // Dark-mode variants (`media="(prefers-color-scheme: dark)"`) go after their light counterparts.
    const darkVariant = (attributes.media ?? '').toLowerCase().includes('dark') ? 0.5 : 0
    const score = (isTouch ? 100 + size / 1000 : isSvg ? 10_000 : 1_000 + Math.min(size, 512)) - darkVariant
    candidates.push({ url: url.href, score })
  }

  const ordered = candidates.sort((a, b) => b.score - a.score).map((candidate) => candidate.url)
  const fallback = new URL('/favicon.ico', pageUrl).href
  return [...new Set([...ordered, fallback])]
}

const readAttributes = (tag: string) => {
  const attributes: Record<string, string> = {}
  for (const match of tag.matchAll(/([a-zA-Z-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '')
  }
  return attributes
}

const decodeEntities = (value: string) => value.replace(/&amp;/g, '&').replace(/&#x2F;/gi, '/').replace(/&#47;/g, '/')

/** `sizes="16x16 32x32"` → 32; `any` → 512; missing → 0. */
const largestSize = (sizes: string | undefined) => {
  if (!sizes) return 0
  if (sizes.toLowerCase().includes('any')) return 512
  return Math.max(0, ...sizes.split(/\s+/).map((size) => Number.parseInt(size.split(/x/i)[0] ?? '', 10) || 0))
}
