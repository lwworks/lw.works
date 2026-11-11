/** Euro amount in German notation (`1.234,50`, `95`, `95 €`) as integer cents, or `null`. */
export const parseEuroCents = (input: string) => {
  const value = input.replace(/\s|€|\./g, '').replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return null
  return Math.round(Number(value) * 100)
}
