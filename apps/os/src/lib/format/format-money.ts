const formats = new Map<string, Intl.NumberFormat>()

/**
 * Cents → `1.234,56 €` (or `12.770,00 $`). `whole` drops the cents, for KPIs; `compact` gives `11.000 €` → `11 Tsd. €`,
 * for chart axes.
 */
export const formatMoney = (cents: number, currency = 'EUR', { whole = false, compact = false }: { whole?: boolean; compact?: boolean } = {}) => {
  const key = `${currency}-${whole}-${compact}`
  let format = formats.get(key)
  if (!format) {
    format = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency,
      ...(whole || compact ? { maximumFractionDigits: 0, minimumFractionDigits: 0 } : {}),
      ...(compact ? { notation: 'compact' as const } : {}),
    })
    formats.set(key, format)
  }
  return format.format(cents / 100)
}
