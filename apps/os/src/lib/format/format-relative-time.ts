const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
]

const formatter = new Intl.RelativeTimeFormat('de-DE', { numeric: 'auto' })

/** „gerade eben“, „vor 5 Minuten“, „gestern“, „vor 9 Wochen“, … Past dates only; future dates count as „gerade eben“. */
export const formatRelativeTime = (date: Date, now: Date = new Date()) => {
  const elapsed = now.getTime() - date.getTime()
  for (const [unit, ms] of UNITS) {
    if (elapsed >= ms) return formatter.format(-Math.floor(elapsed / ms), unit)
  }
  return 'gerade eben'
}
