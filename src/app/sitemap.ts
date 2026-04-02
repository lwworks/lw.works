import type {MetadataRoute} from 'next'
import {routing, baseUrl, landingPages, getLandingPageSlug} from '@/i18n/routing'
import type {LandingPageKey} from '@/i18n/routing'

const pathnames = {
  '/': {de: '/', en: '/'},
  '/leistungen': {de: '/leistungen', en: '/services'},
  '/blog': {de: '/blog', en: '/blog'},
} as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const paths of Object.values(pathnames)) {
    for (const locale of routing.locales) {
      const slug = paths[locale]
      const url = slug === '/' ? `${baseUrl}/${locale}` : `${baseUrl}/${locale}${slug}`

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: slug === '/' ? 1 : 0.8,
        alternates: {
          languages: {
            de: paths.de === '/' ? `${baseUrl}/de` : `${baseUrl}/de${paths.de}`,
            en: paths.en === '/' ? `${baseUrl}/en` : `${baseUrl}/en${paths.en}`,
          },
        },
      })
    }
  }

  for (const key of Object.keys(landingPages) as LandingPageKey[]) {
    for (const locale of routing.locales) {
      const slug = getLandingPageSlug(key, locale)
      entries.push({
        url: `${baseUrl}/${locale}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: {
            de: `${baseUrl}/de/${getLandingPageSlug(key, 'de')}`,
            en: `${baseUrl}/en/${getLandingPageSlug(key, 'en')}`,
          },
        },
      })
    }
  }

  return entries
}
