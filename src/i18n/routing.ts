import { defineRouting } from 'next-intl/routing'
import { type Locale, locales } from './locale'
import { slugs as blogSlugs } from '@/content/blog'
import { pageSlugs } from '@/content/pages/slugs'

export { type Locale, locales } from './locale'

const allSlugs: Record<string, Record<Locale, string>> = {
  home: { de: '', en: '' },
  ...pageSlugs,
  blog: blogSlugs
}

const pathnames = Object.fromEntries(
  Object.entries(allSlugs)
    .filter(([key]) => key !== 'home')
    .map(([key, slugs]) => [`/${key}`, { de: `/${slugs.de}`, en: `/${slugs.en}` }])
)

export const routing = defineRouting({
  locales,
  defaultLocale: 'de' satisfies Locale,
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    ...pathnames,
    '/kontakt/[member]': {
      de: '/kontakt/[member]',
      en: '/contact/[member]'
    }
  }
})

export type Pathnames = keyof typeof routing.pathnames

export const baseUrl = 'https://lw.works'
