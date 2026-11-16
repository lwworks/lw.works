import { shiftMonth } from '@/lib/finance/shift-month'

/** Every `YYYY-MM` from `from` to `to`, both included; empty if `to` is before `from`. */
export const listMonths = (from: string, to: string) => {
  const months: string[] = []
  for (let month = from; month <= to; month = shiftMonth(month, 1)) months.push(month)
  return months
}
