/** `YYYY-MM-DD` as a local calendar day (midnight), or `undefined` when it is not a real date. */
export const parseDateKey = (value: string | null | undefined) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '')
  if (!match) return undefined
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])]
  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return undefined
  return date
}
