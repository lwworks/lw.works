export const PROJECT_KEY_PATTERN = /^[A-Z][A-Z0-9]{1,5}$/

const PREFIX = /^([A-Z][A-Z0-9]{1,5}):\s*([\s\S]*)$/

/**
 * Reads a project key prefix from a calendar title: `BR: Abstimmung` → `{ key: 'BR', rest: 'Abstimmung' }`.
 * Only uppercase keys directly followed by a colon count; `BR Abstimmung`, `[BR] …`, and `br: …` do not.
 */
export const parseProjectKey = (title: string) => {
  const match = PREFIX.exec(title.trim())
  if (!match) return null
  return { key: match[1], rest: match[2].trim() }
}
