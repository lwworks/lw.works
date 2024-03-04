export const i18n = {
  defaultLocale: 'de',
  locales: ['de', 'en'],
  equivalents: [
    {
      de: '/kontakt',
      en: '/contact'
    },
    {
      de: '/impressum',
      en: '/legal'
    },
    {
      de: '/datenschutz',
      en: '/privacy'
    },
    {
      de: '/blog/der-linear-effekt',
      en: '/blog/linear-effect'
    },
    {
      de: '/blog/was-ist-der-jamstack',
      en: '/blog/what-is-jamstack'
    }
  ]
} as const

export type Locale = (typeof i18n)['locales'][number]
