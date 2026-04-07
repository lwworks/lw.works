import { pages, getPageKeyBySlug, getPageSlug, pageSlugs } from '@/content/pages'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return Object.values(pageSlugs).flatMap((slugs) =>
    routing.locales.map((locale) => ({ locale, slug: slugs[locale] }))
  )
}

export async function generateMetadata({ params }: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const key = getPageKeyBySlug(slug, locale as Locale)
  if (!key) notFound()

  const page = pages[key]
  const content = await page.loadContent(locale as Locale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/${slug}`,
      languages: {
        de: `${baseUrl}/de/${getPageSlug(key, 'de')}`,
        en: `${baseUrl}/en/${getPageSlug(key, 'en')}`,
        'x-default': `${baseUrl}/de/${getPageSlug(key, 'de')}`
      }
    },
    openGraph: {
      title: content.metadata.title!,
      description: content.metadata.description!,
      url: `${baseUrl}/${locale}/${slug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US'
    }
  }
}

export default async function LandingPage({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const key = getPageKeyBySlug(slug, locale as Locale)
  if (!key) notFound()

  return pages[key].render(locale as Locale)
}
