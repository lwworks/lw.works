import { project } from '@/lib/db/schema/projects'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { sql } from 'drizzle-orm'

/** Tracked milliseconds of the project row's live entries (all users); running entries count up to now. */
export const trackedMsSql = () =>
  sql<number>`coalesce((
    select sum(greatest(0, extract(epoch from least(${timeEntry.endAt}, now()) - ${timeEntry.startAt}))) * 1000
    from ${timeEntry}
    where ${timeEntry.projectId} = ${project.id} and ${timeEntry.deletedAt} is null
  ), 0)`.mapWith(Number)
