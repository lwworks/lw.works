import { timeEntry } from '@/lib/db/schema/time-tracking'
import { sql } from 'drizzle-orm'

/** The `KEY` of a `KEY: …` title in SQL, matching `parseProjectKey`, or NULL. */
export const titleProjectKeySql = () => sql`substring(btrim(${timeEntry.title}) from '^([A-Z][A-Z0-9]{1,5}):')`
