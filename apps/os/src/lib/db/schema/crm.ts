import { sql } from 'drizzle-orm'
import { boolean, check, index, integer, jsonb, pgTable, primaryKey, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'
import { account, user } from './auth'

const timestamptz = (name: string) => timestamp(name, { withTimezone: true })

export type ContactGoogleLinkStatus = 'pending' | 'ok' | 'reauth_required' | 'missing_scope'

/**
 * One email address or phone number of a contact. `type` is the Google Contacts type (`work`, `home`, `mobile`, `other`, …)
 * or a custom label from Google; null when unset. List order is kept and the first entry is the primary one.
 */
export type ContactLabeledValue = { value: string; type: string | null }

export type CompanyLogoSource = 'favicon' | 'upload' | 'legacy_url'

/**
 * Shared company. Nothing here is sent to Google. No phone. Addresses live in `company_location`.
 * The logo is an object in the logo bucket (`logoKey`). It is imported once, in the background, from the website's
 * favicon (`logoCheckedAt` marks that attempt, successful or not) and can be replaced by an upload.
 * `logoUrl` is the old manually entered logo URL: no longer editable, only read by that one-time import. Drop it once
 * every company has been checked.
 */
export const company = pgTable('company', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  logoKey: text('logo_key'),
  logoSource: text('logo_source').$type<CompanyLogoSource>(),
  logoCheckedAt: timestamptz('logo_checked_at'),
  website: text('website'),
  createdAt: timestamptz('created_at').defaultNow().notNull(),
  updatedAt: timestamptz('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

/** One site of a company (head office, branch, …). `position` orders them; the first is the main site. */
export const companyLocation = pgTable(
  'company_location',
  {
    id: text('id').primaryKey(),
    companyId: text('company_id')
      .notNull()
      .references(() => company.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    label: text('label'),
    street: text('street'),
    postalCode: text('postal_code'),
    city: text('city'),
    country: text('country'),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('company_location_company_idx').on(table.companyId, table.position)],
)

/** Shared tag. Name is unique case-insensitively. Never synced. */
export const tag = pgTable(
  'tag',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    color: text('color').notNull(),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('tag_name_lower_idx').on(sql`lower(${table.name})`)],
)

/**
 * Address-book contact. `display_id` is a global identity and is never reused.
 * Rows are soft-deleted (`deleted_at`). Synced-field edits stamp `synced_fields_edited_at`;
 * a daily pull stamps `last_inbound_at` and does not touch the edit stamp.
 */
export const contact = pgTable(
  'contact',
  {
    id: text('id').primaryKey(),
    displayId: integer('display_id')
      .generatedAlwaysAsIdentity({ name: 'contact_display_id_seq', startWith: 1 })
      .notNull(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name').notNull(),
    emails: jsonb('emails').$type<ContactLabeledValue[]>().default([]).notNull(),
    phones: jsonb('phones').$type<ContactLabeledValue[]>().default([]).notNull(),
    whatsApp: text('whats_app'),
    linkedIn: text('linked_in'),
    instagram: text('instagram'),
    x: text('x'),
    avatarUrl: text('avatar_url'),
    birthdayMonth: integer('birthday_month'),
    birthdayDay: integer('birthday_day'),
    birthdayYear: integer('birthday_year'),
    isPrivate: boolean('is_private').default(false).notNull(),
    companyId: text('company_id').references(() => company.id, { onDelete: 'set null' }),
    createdByUserId: text('created_by_user_id')
      .notNull()
      .references(() => user.id),
    deletedAt: timestamptz('deleted_at'),
    syncedFieldsEditedAt: timestamptz('synced_fields_edited_at'),
    lastInboundAt: timestamptz('last_inbound_at'),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex('contact_display_id_idx').on(table.displayId),
    index('contact_company_idx').on(table.companyId),
    check('contact_has_name', sql`${table.firstName} <> '' OR ${table.lastName} <> ''`),
    check(
      'contact_birthday_pair',
      sql`(${table.birthdayMonth} IS NULL AND ${table.birthdayDay} IS NULL) OR (${table.birthdayMonth} IS NOT NULL AND ${table.birthdayDay} IS NOT NULL)`,
    ),
  ],
)

export const contactTag = pgTable(
  'contact_tag',
  {
    contactId: text('contact_id')
      .notNull()
      .references(() => contact.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tag.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.contactId, table.tagId] })],
)

/** Google People resource created for one contact on one member account. */
export const contactGoogleLink = pgTable(
  'contact_google_link',
  {
    id: text('id').primaryKey(),
    contactId: text('contact_id')
      .notNull()
      .references(() => contact.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accountId: text('account_id')
      .notNull()
      .references(() => account.id, { onDelete: 'cascade' }),
    googleResourceName: text('google_resource_name'),
    etag: text('etag'),
    status: text('status').$type<ContactGoogleLinkStatus>().default('pending').notNull(),
    lastError: text('last_error'),
    lastPushedAt: timestamptz('last_pushed_at'),
    createdAt: timestamptz('created_at').defaultNow().notNull(),
    updatedAt: timestamptz('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [uniqueIndex('contact_google_link_contact_account_idx').on(table.contactId, table.accountId)],
)

export type Company = typeof company.$inferSelect
export type CompanyLocation = typeof companyLocation.$inferSelect
export type Tag = typeof tag.$inferSelect
export type Contact = typeof contact.$inferSelect
export type ContactGoogleLink = typeof contactGoogleLink.$inferSelect
