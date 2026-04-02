import { DigitalDealerPage, type DigitalDealerPageContent } from '@/components/pages/digital-dealer'
import { getPageContent } from '@/content/pages'
import type { Locale } from '@/i18n/routing'
import { baseUrl, getPageKeyBySlug, getPageSlug, pages, routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return Object.values(pages).flatMap((slugs) => routing.locales.map((locale) => ({ locale, slug: slugs[locale] })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const key = getPageKeyBySlug(slug, locale as Locale)
  if (!key) notFound()

  const content = await getPageContent(key, locale as Locale)
  const deSlug = getPageSlug(key, 'de')
  const enSlug = getPageSlug(key, 'en')

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/${slug}`,
      languages: {
        de: `${baseUrl}/de/${deSlug}`,
        en: `${baseUrl}/en/${enSlug}`,
        'x-default': `${baseUrl}/de/${deSlug}`,
      },
    },
    openGraph: {
      title: content.metadata.title!,
      description: content.metadata.description!,
      url: `${baseUrl}/${locale}/${slug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function LandingPage({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const key = getPageKeyBySlug(slug, locale as Locale)
  if (!key) notFound()

  const content = await getPageContent(key, locale as Locale)

  switch (key) {
    case 'digital-dealer':
      return <DigitalDealerPage content={content as DigitalDealerPageContent} />
    default:
      notFound()
  }
}
