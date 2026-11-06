import { readOptionalText } from '@/lib/contacts/read-optional-text'

/** `https` URL or empty. Anything else is rejected. */
export const parseHttpsUrl = (value: FormDataEntryValue | null, max = 500): { ok: true; value: string | null } | { ok: false } => {
  const text = readOptionalText(value, max)
  if (!text) return { ok: true, value: null }
  try {
    const url = new URL(text)
    if (url.protocol !== 'https:') return { ok: false }
    return { ok: true, value: url.toString() }
  } catch {
    return { ok: false }
  }
}
