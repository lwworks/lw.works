import {defineRouting} from 'next-intl/routing'

export const pages = {
  home: {
    de: '',
    en: ''
  },
  'design-engineering': {
    de: 'design-engineering-studio',
    en: 'design-engineering-studio'
  },
  automation: {
    de: 'automatisierung',
    en: 'automation'
  },
  'digital-dealer': {
    de: 'digital-dealer-autohaus-website-paket',
    en: 'digital-dealer-car-dealership-websites'
  },
  contact: {
    de: 'kontakt',
    en: 'contact'
  },
  privacy: {
    de: 'datenschutz',
    en: 'privacy'
  }
} as const

export type PageKey = keyof typeof pages

const pagePathnames = Object.fromEntries(
  Object.entries(pages)
    .filter(([key]) => key !== 'home')
    .map(([key, slugs]) => [`/${key}`, {de: `/${slugs.de}`, en: `/${slugs.en}`}])
)

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    ...pagePathnames
  }
})

export type Locale = (typeof routing.locales)[number]
export type Pathnames = keyof typeof routing.pathnames

export const baseUrl = 'https://lw.works'

export function getPageKeyBySlug(slug: string, locale: Locale): PageKey | null {
  for (const [key, slugs] of Object.entries(pages)) {
    if (slugs[locale] === slug) {
      return key as PageKey
    }
  }
  return null
}

export function getPageSlug(key: PageKey, locale: Locale): string {
  return pages[key][locale]
}
