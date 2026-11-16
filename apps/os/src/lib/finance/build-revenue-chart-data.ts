/** Chart rows: one per month of `current`, with the same month a year earlier from `comparison` (same length) if given. */
export const buildRevenueChartData = (
  current: { month: string; netEurCents: number; count: number }[],
  comparison: { month: string; netEurCents: number }[] | null,
) =>
  current.map((row, index) => ({
    month: row.month,
    netEurCents: row.netEurCents,
    count: row.count,
    comparisonMonth: comparison?.[index]?.month ?? null,
    comparisonNetEurCents: comparison?.[index]?.netEurCents ?? null,
  }))

export type RevenueChartRow = ReturnType<typeof buildRevenueChartData>[number]
