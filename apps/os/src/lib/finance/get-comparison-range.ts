import { listMonths } from '@/lib/finance/list-months'
import { shiftMonth } from '@/lib/finance/shift-month'

/** The same months one year earlier, for ranges of up to 12 months; null for longer ones. */
export const getComparisonRange = (range: { from: string; to: string }) =>
  listMonths(range.from, range.to).length <= 12 ? { from: shiftMonth(range.from, -12), to: shiftMonth(range.to, -12) } : null
