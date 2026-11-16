import type { RevenuePreset, RevenueRange } from '@/lib/finance/revenue-range'
import { shiftMonth } from '@/lib/finance/shift-month'

const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/
const PRESETS: RevenuePreset[] = ['12m', 'jahr', 'vorjahr', 'alles', 'frei']

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

/**
 * `?zeitraum=12m|jahr|vorjahr|alles` or `?zeitraum=frei&von=2024-01&bis=2024-12` → months. Defaults to the last 12
 * months. `currentMonth` is today's `YYYY-MM`; `firstMonth` the month of the first invoice (for `alles`).
 */
export const parseRevenueRange = (
  params: { zeitraum?: string | string[]; von?: string | string[]; bis?: string | string[] },
  currentMonth: string,
  firstMonth: string | null,
): RevenueRange => {
  const raw = first(params.zeitraum)
  const preset = PRESETS.includes(raw as RevenuePreset) ? (raw as RevenuePreset) : '12m'
  const year = currentMonth.slice(0, 4)

  if (preset === 'jahr') return { preset, from: `${year}-01`, to: `${year}-12` }
  if (preset === 'vorjahr') return { preset, from: `${Number(year) - 1}-01`, to: `${Number(year) - 1}-12` }
  if (preset === 'alles') return { preset, from: firstMonth && firstMonth < currentMonth ? firstMonth : currentMonth, to: currentMonth }
  if (preset === 'frei') {
    const from = first(params.von)
    const to = first(params.bis)
    if (from && to && MONTH.test(from) && MONTH.test(to)) return { preset, from: from <= to ? from : to, to: from <= to ? to : from }
  }
  return { preset: '12m', from: shiftMonth(currentMonth, -11), to: currentMonth }
}
