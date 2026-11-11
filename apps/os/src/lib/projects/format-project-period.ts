const formatDay = (date: string) => {
  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

/** `01.11.2026 – 31.12.2026`, `ab 01.11.2026`, `bis 31.12.2026`, or `null` without dates. */
export const formatProjectPeriod = ({ startDate, endDate }: { startDate: string | null; endDate: string | null }) => {
  if (startDate && endDate) return `${formatDay(startDate)} – ${formatDay(endDate)}`
  if (startDate) return `ab ${formatDay(startDate)}`
  if (endDate) return `bis ${formatDay(endDate)}`
  return null
}
