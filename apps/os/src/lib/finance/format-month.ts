const long = new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric', timeZone: 'UTC' })
const short = new Intl.DateTimeFormat('de-DE', { month: 'short', year: '2-digit', timeZone: 'UTC' })

/** `2026-03` → `März 2026`, or `März 26` with `short`. */
export const formatMonth = (month: string, { short: isShort = false }: { short?: boolean } = {}) =>
  (isShort ? short : long).format(new Date(`${month}-01T00:00:00Z`))
