import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { insertTag } from '@/lib/db/tags/insert-tag'
import { parseTagInput } from '@/lib/tags/parse-tag-input'

export const createTag = async (formData: FormData) => {
  await requireUserId()
  const parsed = parseTagInput(formData)
  if (!parsed.ok) return parsed
  return insertTag(parsed.value)
}
