import 'server-only'

import { requireUserId } from '@/lib/auth/require-user-id'
import { getDb } from '@/lib/db/get-db'
import { postgresErrorCode } from '@/lib/db/postgres-error-code'
import { tag } from '@/lib/db/schema/crm'
import type { TagInput } from '@/lib/tags/parse-tag-input'

export const insertTag = async (input: TagInput) => {
  await requireUserId()
  try {
    const [row] = await getDb()
      .insert(tag)
      .values({ id: crypto.randomUUID(), ...input })
      .returning({ id: tag.id })
    if (!row) throw new Error('Tag insert returned no row')
    return { ok: true as const, id: row.id }
  } catch (error) {
    if (postgresErrorCode(error) === '23505') return { ok: false as const, message: 'Dieser Tag existiert bereits.' }
    throw error
  }
}
