import { readOptionalText } from '@/lib/contacts/read-optional-text'
import type { ContactLabeledValue } from '@/lib/db/schema/crm'

/** Form value of the type select for "no type". Radix Select cannot use an empty string as an item value. */
export const NO_VALUE_TYPE = 'none'

/**
 * Reads repeated `<prefix>Value` / `<prefix>Type` fields by position. Empty values are dropped, the same value is kept once
 * (case-insensitively, ignoring spaces), and the order is kept, so the first entry stays the primary one.
 */
export const readLabeledValues = (formData: FormData, prefix: string, maxLength: number): ContactLabeledValue[] => {
  const values = formData.getAll(`${prefix}Value`)
  const types = formData.getAll(`${prefix}Type`)
  const seen = new Set<string>()
  const result: ContactLabeledValue[] = []
  values.forEach((raw, index) => {
    const value = readOptionalText(raw, maxLength)
    if (!value) return
    const key = value.toLocaleLowerCase('de').replace(/\s/g, '')
    if (seen.has(key)) return
    seen.add(key)
    const type = readOptionalText(types[index] ?? null, 50)
    result.push({ value, type: type && type !== NO_VALUE_TYPE ? type : null })
  })
  return result
}
