import { project } from '@/lib/db/schema/projects'
import { timeEntry } from '@/lib/db/schema/time-tracking'
import { sql } from 'drizzle-orm'

const billedFilter = {
  all: sql``,
  open: sql` and ${timeEntry.billedAt} is null`,
  billed: sql` and ${timeEntry.billedAt} is not null`,
}

/** Tracked milliseconds of the project row's live entries (all users); running entries count up to now. `billing` narrows to open or billed entries. */
export const trackedMsSql = (billing: keyof typeof billedFilter = 'all') =>
  sql<number>`coalesce((
    select sum(greatest(0, extract(epoch from least(${timeEntry.endAt}, now()) - ${timeEntry.startAt}))) * 1000
    from ${timeEntry}
    where ${timeEntry.projectId} = ${project.id} and ${timeEntry.deletedAt} is null${billedFilter[billing]}
  ), 0)`.mapWith(Number)
