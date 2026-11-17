const ALLOWED_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

/**
 * A link target that is safe to render: http(s), mailto or tel. A bare domain (`lw.works/x`) becomes https.
 * Returns null for anything else (`javascript:`, `data:`, relative paths, garbage).
 */
export const safeNoteHref = (raw: string): string | null => {
  const value = raw.trim()
  if (!value || value.length > 2048) return null
  const withProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value) ? value : /^[^\s/]+\.[^\s/]+/.test(value) ? `https://${value}` : null
  if (!withProtocol) return null
  try {
    const url = new URL(withProtocol)
    if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null
    if ((url.protocol === 'http:' || url.protocol === 'https:') && !url.hostname) return null
    return url.href
  } catch {
    return null
  }
}
