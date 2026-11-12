/**
 * A company website as entered (`example.com`, `https://www.example.com/de`) → its http(s) URL, or null.
 * Rejects hosts that are not public domain names (localhost, IP literals, single labels, custom ports). This is only a
 * first filter on the text: `safeGet` also checks the resolved IP address at connect time and re-checks every redirect.
 */
export const toWebsiteUrl = (website: string | null): URL | null => {
  const trimmed = website?.trim()
  if (!trimmed) return null
  let url: URL
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (url.username || url.password || url.port) return null
  const host = url.hostname.toLowerCase()
  if (!host.includes('.') || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) return null
  if (/^[\d.]+$/.test(host) || host.startsWith('[')) return null
  return url
}
