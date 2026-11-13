import 'server-only'

import { upsertContactGoogleLink } from '@/lib/db/contact-google-links/upsert-contact-google-link'
import { listLinksForContact } from '@/lib/db/contact-google-links/list-links-for-contact'
import { getContactForPush } from '@/lib/db/contacts/get-contact-for-push'
import { listGoogleAccounts } from '@/lib/db/users/list-google-accounts'
import type { ContactGoogleLinkStatus } from '@/lib/db/schema/crm'
import { ReauthRequiredError } from '@/lib/google-calendar/get-access-token'
import { contactAudience } from '@/lib/google-contacts-sync/contact-audience'
import { createGoogleContact } from '@/lib/google-contacts-sync/create-google-contact'
import { deleteGoogleContact } from '@/lib/google-contacts-sync/delete-google-contact'
import { GooglePeopleError } from '@/lib/google-contacts-sync/google-people-error'
import { hasContactsScope } from '@/lib/google-contacts-sync/has-contacts-scope'
import { planAccountPush } from '@/lib/google-contacts-sync/plan-account-push'
import type { SyncedContactFields } from '@/lib/google-contacts-sync/synced-contact-fields'
import { updateGoogleContact } from '@/lib/google-contacts-sync/update-google-contact'

const safeError = (error: unknown) => {
  if (error instanceof GooglePeopleError) return error.message.slice(0, 300)
  if (error instanceof ReauthRequiredError) return 'Google-Zugang abgelaufen.'
  return 'Google Kontakte nicht erreichbar.'
}

const failureStatus = (error: unknown): ContactGoogleLinkStatus => {
  if (error instanceof ReauthRequiredError) return 'reauth_required'
  if (error instanceof GooglePeopleError && error.isMissingScope) return 'missing_scope'
  return 'pending'
}

/**
 * Pushes one contact to the current audience, or deletes it outside that audience.
 * A Google failure leaves the link pending for the next outbound event and does not roll back the OS row.
 * This is not called by the daily pull.
 */
export const pushContact = async (contactId: string) => {
  const row = await getContactForPush(contactId)
  if (!row) return

  const accounts = await listGoogleAccounts()
  const memberIds = [...new Set(accounts.map((account) => account.userId))]
  const audience = new Set(
    row.deletedAt ? [] : contactAudience({ isPrivate: row.isPrivate, createdByUserId: row.createdByUserId, memberIds }),
  )
  const links = new Map((await listLinksForContact(contactId)).map((link) => [link.accountId, link]))
  const fields: SyncedContactFields = {
    firstName: row.firstName,
    lastName: row.lastName,
    emails: row.emails,
    phones: row.phones,
    whatsApp: row.whatsApp,
    birthday:
      row.birthdayMonth && row.birthdayDay
        ? { month: row.birthdayMonth, day: row.birthdayDay, ...(row.birthdayYear ? { year: row.birthdayYear } : {}) }
        : null,
  }

  for (const account of accounts) {
    const link = links.get(account.accountId)
    const plan = planAccountPush({
      inAudience: audience.has(account.userId),
      hasScope: hasContactsScope(account.scope),
      hasResourceName: Boolean(link?.googleResourceName),
    })
    let resourceName = link?.googleResourceName ?? null
    let etag = link?.etag ?? null

    try {
      if (plan === 'skip') continue
      if (plan === 'missing-scope') {
        await upsertContactGoogleLink({
          contactId,
          userId: account.userId,
          accountId: account.accountId,
          googleResourceName: resourceName,
          etag,
          status: 'missing_scope',
          lastError: 'Google Kontakte erneut verbinden.',
          lastPushedAt: link?.lastPushedAt ?? null,
        })
        continue
      }
      if (plan === 'delete') {
        if (resourceName) {
          try {
            await deleteGoogleContact(account, resourceName)
          } catch (error) {
            if (!(error instanceof GooglePeopleError) || error.status !== 404) throw error
          }
        }
        await upsertContactGoogleLink({
          contactId,
          userId: account.userId,
          accountId: account.accountId,
          googleResourceName: null,
          etag: null,
          status: 'ok',
          lastError: null,
          lastPushedAt: new Date(),
        })
        continue
      }

      if (resourceName) {
        try {
          const updated = await updateGoogleContact(account, resourceName, etag, fields)
          resourceName = updated.resourceName ?? resourceName
          etag = updated.etag ?? etag
        } catch (error) {
          if (!(error instanceof GooglePeopleError) || error.status !== 404) throw error
          resourceName = null
          etag = null
        }
      }
      if (!resourceName) {
        const created = await createGoogleContact(account, fields)
        resourceName = created.resourceName ?? null
        etag = created.etag ?? null
        if (!resourceName) throw new GooglePeopleError(502, [], 'People API returned no resource name')
      }
      await upsertContactGoogleLink({
        contactId,
        userId: account.userId,
        accountId: account.accountId,
        googleResourceName: resourceName,
        etag,
        status: 'ok',
        lastError: null,
        lastPushedAt: new Date(),
      })
    } catch (error) {
      const message = safeError(error)
      console.error(`Contact push failed for ${contactId} on account ${account.accountId}: ${message}`)
      await upsertContactGoogleLink({
        contactId,
        userId: account.userId,
        accountId: account.accountId,
        googleResourceName: resourceName,
        etag,
        status: failureStatus(error),
        lastError: message,
        lastPushedAt: link?.lastPushedAt ?? null,
      }).catch(() => undefined)
    }
  }
}
