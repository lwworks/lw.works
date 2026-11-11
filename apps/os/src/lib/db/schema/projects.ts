import { sql } from 'drizzle-orm'
import { check, date, index, integer, pgTable, primaryKey, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { company, contact } from './crm'

const timestamptz = (name: string) => timestamp(name, { withTimezone: true })

export type ProjectBilling = 'hourly' | 'fixed' | 'retainer'
export type ProjectStatus = 'planning' | 'active' | 'completed'

/**
 * Shared project for one customer company. `key` (e.g. `BR`) is set once and never changed; it is unique only among
 * non-archived projects, so archiving frees it. `slug` follows the title and is unique across all projects.
 * Amounts are EUR cents (net); retainer amount and hours are per month.
 */
export const project = pgTable(
  'project',
  {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    status: text('status').$type<ProjectStatus>().default('planning').notNull(),
    startDate: date('start_date', { mode: 'string' }),
    endDate: date('end_date', { mode: 'string' }),
    companyId: text('company_id')
      .notNull()
      .references(() => company.id, { onDelete: 'restrict' }),
    billing: text('billing').$type<ProjectBilling>().notNull(),
    hourlyRateCents: integer('hourly_rate_cents'),
    fixedPriceCents: integer('fixed_price_cents'),
    retainerAmountCents: integer('retainer_amount_cents'),
    retainerHours: integer('retainer_hours'),
    archivedAt: timestamptz('archived_at'),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('project_active_key_idx').on(table.key).where(sql`${table.archivedAt} IS NULL`),
    uniqueIndex('project_slug_idx').on(table.slug),
    index('project_company_idx').on(table.companyId),
    check('project_key_format', sql`${table.key} ~ '^[A-Z][A-Z0-9]{1,5}$'`),
    check('project_status', sql`${table.status} IN ('planning', 'active', 'completed')`),
    check('project_dates', sql`${table.startDate} IS NULL OR ${table.endDate} IS NULL OR ${table.endDate} >= ${table.startDate}`),
    check(
      'project_billing_fields',
      sql`(${table.billing} = 'hourly' AND ${table.hourlyRateCents} IS NOT NULL AND ${table.fixedPriceCents} IS NULL AND ${table.retainerAmountCents} IS NULL AND ${table.retainerHours} IS NULL)
        OR (${table.billing} = 'fixed' AND ${table.fixedPriceCents} IS NOT NULL AND ${table.hourlyRateCents} IS NULL AND ${table.retainerAmountCents} IS NULL AND ${table.retainerHours} IS NULL)
        OR (${table.billing} = 'retainer' AND ${table.retainerAmountCents} IS NOT NULL AND ${table.retainerHours} IS NOT NULL AND ${table.hourlyRateCents} IS NULL AND ${table.fixedPriceCents} IS NULL)`,
    ),
  ],
)

/** Contact persons of a project. */
export const projectContact = pgTable(
  'project_contact',
  {
    projectId: text('project_id')
      .notNull()
      .references(() => project.id, { onDelete: 'cascade' }),
    contactId: text('contact_id')
      .notNull()
      .references(() => contact.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.projectId, table.contactId] }), index('project_contact_contact_idx').on(table.contactId)],
)

export type Project = typeof project.$inferSelect
