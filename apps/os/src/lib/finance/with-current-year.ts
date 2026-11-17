/** Year tabs of the invoice list: the years that have invoices plus the current year (selected by default), newest first. */
export const withCurrentYear = (years: number[], currentYear: number) =>
  years.includes(currentYear) ? years : [...years, currentYear].toSorted((a, b) => b - a)
