import { index, jsonb, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { account, user } from './auth-schema'

export type TimeEntryAttendee = {
  email: string
  displayName?: string
  responseStatus?: string
  organizer?: boolean
  self?: boolean
  optional?: boolean
}

const timestamptz = (name: string) => timestamp(name, { withTimezone: true })

export const timeEntry = pgTable(
  'time_entry',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    calendarId: text('calendar_id').notNull(),
    googleEventId: text('google_event_id').notNull(),
    googleRecurringEventId: text('google_recurring_event_id'),
    googleICalUid: text('google_ical_uid'),
    title: text('title').notNull(),
    description: text('description'),
    location: text('location'),
    attendees: jsonb('attendees').$type<TimeEntryAttendee[]>().default([]).notNull(),
    startAt: timestamptz('start_at').notNull(),
    endAt: timestamptz('end_at').notNull(),
    timeZone: text('time_zone'),
    htmlLink: text('html_link'),
    googleStatus: text('google_status').notNull(),
    googleUpdatedAt: timestamptz('google_updated_at').notNull(),
    lastSeenAt: timestamptz('last_seen_at').notNull(),
    deletedAt: timestamptz('deleted_at'),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('time_entry_user_calendar_event_idx').on(table.userId, table.calendarId, table.googleEventId),
    index('time_entry_user_start_idx').on(table.userId, table.startAt),
    index('time_entry_user_recurring_idx').on(table.userId, table.googleRecurringEventId),
  ],
)

export type CalendarSyncStatus = 'pending' | 'ok' | 'reauth_required' | 'missing_scope' | 'error'

export const calendarSyncState = pgTable(
  'calendar_sync_state',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accountId: text('account_id')
      .notNull()
      .references(() => account.id, { onDelete: 'cascade' }),
    calendarId: text('calendar_id').notNull(),
    status: text('status').$type<CalendarSyncStatus>().default('pending').notNull(),
    lastError: text('last_error'),
    /** Every event starting before this instant has been fetched, and every change before it seen. */
    syncedUntil: timestamptz('synced_until'),
    lastFullSyncAt: timestamptz('last_full_sync_at'),
    lastSyncedAt: timestamptz('last_synced_at'),
    lockedUntil: timestamptz('locked_until'),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('calendar_sync_state_user_calendar_idx').on(table.userId, table.calendarId)],
)
