/** Cents as an input value in German notation without currency (`1234,5` → `"1.234,50"`). */
export const formatCentsInput = (cents: number) =>
  new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(cents / 100)
