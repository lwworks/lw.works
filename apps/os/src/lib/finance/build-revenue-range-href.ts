import type { RevenueRange } from '@/lib/finance/revenue-range'

/** `/finanzen` URL for a range and the comparison toggle; the default (last 12 months, no comparison) is bare. */
export const buildRevenueRangeHref = (range: Pick<RevenueRange, 'preset'> & Partial<Pick<RevenueRange, 'from' | 'to'>>, compare: boolean) => {
  const params = new URLSearchParams()
  if (range.preset !== '12m') params.set('zeitraum', range.preset)
  if (range.preset === 'frei' && range.from && range.to) {
    params.set('von', range.from)
    params.set('bis', range.to)
  }
  if (compare) params.set('vergleich', '1')
  const query = params.toString()
  return query ? `/finanzen?${query}` : '/finanzen'
}
