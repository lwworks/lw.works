import { sql } from 'drizzle-orm'
import { check, index, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import type { NoteDoc } from '../../notes/note-doc'
import { user } from './auth'
import { company, contact } from './crm'
import { project } from './projects'

const timestamptz = (name: string) => timestamp(name, { withTimezone: true })

/**
 * A formatted note on exactly one contact, company or project. `content` is a Tiptap document limited to paragraphs,
 * lists, bold, italic and links (`parseNoteDoc` enforces that on every write). Notes go with their owner
 * (`ON DELETE CASCADE`) and are never synced to Google.
 */
export const note = pgTable(
  'note',
  {
    id: text('id').primaryKey(),
    content: jsonb('content').$type<NoteDoc>().notNull(),
    contactId: text('contact_id').references(() => contact.id, { onDelete: 'cascade' }),
    companyId: text('company_id').references(() => company.id, { onDelete: 'cascade' }),
    projectId: text('project_id').references(() => project.id, { onDelete: 'cascade' }),
    createdByUserId: text('created_by_user_id')
      .notNull()
      .references(() => user.id),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('note_contact_idx').on(table.contactId, table.createdAt),
    index('note_company_idx').on(table.companyId, table.createdAt),
    index('note_project_idx').on(table.projectId, table.createdAt),
    check('note_single_owner', sql`num_nonnulls(${table.contactId}, ${table.companyId}, ${table.projectId}) = 1`),
  ],
)

export type Note = typeof note.$inferSelect
