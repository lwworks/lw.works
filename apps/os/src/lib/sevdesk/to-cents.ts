/** SevDesk amount (`"1713.6"`, number or null) → integer cents. */
export const toCents = (value: string | number | null | undefined) => {
  const amount = typeof value === 'number' ? value : Number.parseFloat(value ?? '')
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0
}
