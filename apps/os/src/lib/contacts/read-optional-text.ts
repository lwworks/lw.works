/** Trimmed text, or null when empty. Longer values are cut to `max`. */
export const readOptionalText = (value: FormDataEntryValue | null, max: number) => {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed) return null
  return trimmed.slice(0, max)
}
