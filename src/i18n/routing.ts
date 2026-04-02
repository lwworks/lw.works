import {defineRouting} from 'next-intl/routing'

export const pages = {
  'web-dev': {
    de: 'website-entwicklung',
    en: 'website-development'
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

const pagePathnames = Object.fromEntries(Object.entries(pages).map(([key, slugs]) => [`/${key}`, {de: `/${slugs.de}`, en: `/${slugs.en}`}])) as {
  [K in PageKey as `/${K}`]: {de: string; en: string}
}

export const routing = defineRouting({
  locales: ['de', 'en'],
  defaultLocale: 'de',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/blog': '/blog',
    '/blog/[slug]': '/blog/[slug]',
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
