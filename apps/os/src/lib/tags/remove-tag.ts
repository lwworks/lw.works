import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { deleteTag } from '@/lib/db/tags/delete-tag'

/** Hard-deletes the tag and detaches it from contacts. Does not call Google. */
export const removeTag = async (id: string) => {
  await requireUserId()
  const row = await deleteTag(id)
  if (!row) return { ok: false as const, message: 'Tag wurde nicht gefunden.' }
  return { ok: true as const }
}
