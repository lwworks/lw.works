import {defineRouting} from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/leistungen': {
      de: '/leistungen',
      en: '/services',
    },
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
  },
})

export type Locale = (typeof routing.locales)[number]
export type Pathnames = keyof typeof routing.pathnames

export const baseUrl = 'https://lw.works'

export const landingPages = {
  'car-dealership-websites': {
    de: 'autohaus-websites',
    en: 'car-dealership-websites',
  },
} as const

export type LandingPageKey = keyof typeof landingPages

export function getLandingPageKeyBySlug(slug: string, locale: Locale): LandingPageKey | null {
  for (const [key, slugs] of Object.entries(landingPages)) {
    if (slugs[locale] === slug) {
      return key as LandingPageKey
    }
  }
  return null
}

export function getLandingPageSlug(key: LandingPageKey, locale: Locale): string {
  return landingPages[key][locale]
}
