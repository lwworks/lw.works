import 'server-only'

import { setAccountLinkStatus } from '@/lib/db/contact-google-links/set-account-link-status'
import { listLinksForPull } from '@/lib/db/contact-google-links/list-links-for-pull'
import { applyInboundContact } from '@/lib/db/contacts/apply-inbound-contact'
import { listContactsForPull } from '@/lib/db/contacts/list-contacts-for-pull'
import { listGoogleAccounts } from '@/lib/db/users/list-google-accounts'
import { ReauthRequiredError } from '@/lib/google-calendar/get-access-token'
import { chooseInboundFields } from '@/lib/google-contacts-sync/choose-inbound-fields'
import { contactAudience } from '@/lib/google-contacts-sync/contact-audience'
import { fromGooglePerson } from '@/lib/google-contacts-sync/from-google-person'
import { GooglePeopleError } from '@/lib/google-contacts-sync/google-people-error'
import { listGoogleConnections } from '@/lib/google-contacts-sync/list-google-connections'
import { hasContactsScope } from '@/lib/google-contacts-sync/has-contacts-scope'

const safeError = (error: unknown) => {
  if (error instanceof GooglePeopleError) return error.message.slice(0, 300)
  if (error instanceof ReauthRequiredError) return 'Google-Zugang abgelaufen.'
  return 'Google Kontakte nicht erreichbar.'
}

/**
 * Daily Google → OS pull. Does not push. A newer OS edit of synced fields is left alone.
 * Soft-deleted contacts are not loaded, so they are not recreated.
 */
export const pullContacts = async () => {
  const accounts = await listGoogleAccounts()
  const summary = { accounts: accounts.length, updated: 0, skipped: 0, failed: 0 }
  const peopleByAccount = new Map<string, Map<string, NonNullable<ReturnType<typeof fromGooglePerson>>>>()

  for (const account of accounts) {
    if (!hasContactsScope(account.scope)) {
      await setAccountLinkStatus(account.accountId, 'missing_scope', 'Google Kontakte erneut verbinden.')
      summary.skipped++
      continue
    }
    try {
      const people = await listGoogleConnections(account)
      const byResource = new Map<string, NonNullable<ReturnType<typeof fromGooglePerson>>>()
      for (const person of people) {
        const parsed = fromGooglePerson(person)
        if (parsed) byResource.set(parsed.resourceName, parsed)
      }
      peopleByAccount.set(account.accountId, byResource)
    } catch (error) {
      summary.failed++
      console.error(`Contacts pull failed for account ${account.accountId}: ${safeError(error)}`)
      if (error instanceof ReauthRequiredError || (error instanceof GooglePeopleError && error.status === 401)) {
        await setAccountLinkStatus(account.accountId, 'reauth_required', safeError(error))
      } else if (error instanceof GooglePeopleError && error.isMissingScope) {
        await setAccountLinkStatus(account.accountId, 'missing_scope', safeError(error))
      }
    }
  }

  const contacts = await listContactsForPull()
  const linksByContact = new Map<string, Awaited<ReturnType<typeof listLinksForPull>>>()
  for (const link of await listLinksForPull()) {
    const group = linksByContact.get(link.contactId) ?? []
    group.push(link)
    linksByContact.set(link.contactId, group)
  }
  const memberIds = [...new Set(accounts.map((account) => account.userId))]
  const at = new Date()

  for (const row of contacts) {
    const audience = new Set(contactAudience({ isPrivate: row.isPrivate, createdByUserId: row.createdByUserId, memberIds }))
    const copies = []
    for (const link of linksByContact.get(row.id) ?? []) {
      if (!audience.has(link.userId) || !link.googleResourceName) continue
      const parsed = peopleByAccount.get(link.accountId)?.get(link.googleResourceName)
      if (!parsed) continue
      copies.push({ updateTime: parsed.updateTime ?? '', fields: parsed.fields })
    }
    const fields = chooseInboundFields(row, copies)
    if (!fields) {
      summary.skipped++
      continue
    }
    const wrote = await applyInboundContact(row.id, fields, at)
    if (wrote) summary.updated++
    else summary.skipped++
  }

  return summary
}
