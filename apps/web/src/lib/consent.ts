import { useMemo, useSyncExternalStore } from 'react'

export const consentCategories = ['necessary', 'analytics', 'maps'] as const
export type ConsentCategory = (typeof consentCategories)[number]

const CONSENT_KEY = 'consent'
const CONSENT_CHANGE_EVENT = 'consent-change'

const subscribe = (onChange: () => void) => {
  window.addEventListener('storage', onChange)
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(CONSENT_CHANGE_EVENT, onChange)
  }
}

const getStoredConsentJson = () => localStorage.getItem(CONSENT_KEY)

// `undefined` while rendering on the server and hydrating, `null` when no consent was stored yet.
const getServerConsentJson = () => undefined

export const storeConsent = (consent: string[]) => {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT))
}

/**
 * Stored cookie consent, shared between the cookie banner and consent-gated content.
 *
 * @returns `undefined` until hydrated, `null` if the visitor has not decided yet,
 *   otherwise the list of accepted categories.
 */
export const useStoredConsent = () => {
  const json = useSyncExternalStore<string | null | undefined>(subscribe, getStoredConsentJson, getServerConsentJson)
  return useMemo<string[] | null | undefined>(() => (json ? JSON.parse(json) : json), [json])
}

/** Adds a single category to the stored consent, e.g. after a click on a content placeholder. */
export const grantConsent = (category: ConsentCategory) => {
  const json = getStoredConsentJson()
  const current: string[] = json ? JSON.parse(json) : ['necessary']
  if (!current.includes(category)) storeConsent([...current, category])
}
