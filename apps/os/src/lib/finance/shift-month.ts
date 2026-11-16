/** `YYYY-MM` moved by `months` (negative goes back). */
export const shiftMonth = (month: string, months: number) => {
  const [year, monthNumber] = month.split('-').map(Number)
  const index = year * 12 + (monthNumber - 1) + months
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, '0')}`
}
