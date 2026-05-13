import { pages, getPageSlug, pageSlugs, type PageKey } from '@/content/pages'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return (Object.keys(pageSlugs) as PageKey[]).flatMap((key) =>
    routing.locales.map((locale) => ({ locale, slug: key }))
  )
}

export async function generateMetadata({ params }: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  if (!(slug in pages)) notFound()

  const key = slug as PageKey
  const typedLocale = locale as Locale
  const content = await pages[key].loadContent(typedLocale)
  const localizedSlug = getPageSlug(key, typedLocale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/${localizedSlug}`,
      languages: {
        de: `${baseUrl}/de/${getPageSlug(key, 'de')}`,
        en: `${baseUrl}/en/${getPageSlug(key, 'en')}`,
        'x-default': `${baseUrl}/de/${getPageSlug(key, 'de')}`
      }
    },
    openGraph: {
      title: content.metadata.title!,
      description: content.metadata.description!,
      url: `${baseUrl}/${locale}/${localizedSlug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US'
    }
  }
}

export default async function LandingPage({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  if (!(slug in pages)) notFound()
  setRequestLocale(locale)

  return pages[slug as PageKey].render(locale as Locale)
}
