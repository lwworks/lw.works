import { readOptionalText } from '@/lib/contacts/read-optional-text'
import { PROJECT_KEY_PATTERN } from '@/lib/projects/parse-project-key'

/** Key and customer, which are set once when the project is created and never change. */
export const parseNewProjectFields = (
  formData: FormData,
): { ok: true; value: { key: string; companyId: string } } | { ok: false; message: string } => {
  const key = readOptionalText(formData.get('key'), 10)?.toUpperCase() ?? ''
  if (!PROJECT_KEY_PATTERN.test(key)) {
    return { ok: false, message: 'Kürzel: 2–6 Zeichen, nur A–Z und 0–9, beginnt mit einem Buchstaben.' }
  }
  const companyId = readOptionalText(formData.get('companyId'), 80)
  if (!companyId) return { ok: false, message: 'Kunde ist erforderlich.' }
  return { ok: true, value: { key, companyId } }
}
