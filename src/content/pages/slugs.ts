import type { Locale } from '@/i18n/locale'

export const pageSlugs = {
  'design-engineering': { de: 'design-engineering-studio', en: 'design-engineering-studio' },
  automation: { de: 'automatisierung', en: 'automation' },
  'digital-dealer': { de: 'digital-dealer-autohaus-website-paket', en: 'digital-dealer-car-dealership-websites' },
  contact: { de: 'kontakt', en: 'contact' },
  privacy: { de: 'datenschutz', en: 'privacy' }
} as const

export type PageKey = keyof typeof pageSlugs

export function getPageSlug(key: PageKey, locale: Locale): string {
  return pageSlugs[key][locale]
}
