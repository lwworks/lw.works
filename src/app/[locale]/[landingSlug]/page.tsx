import {HeroSection} from '@/components/sections/hero'
import {getLandingPageContent} from '@/content/pages/landing-pages'
import {hasLocale} from 'next-intl'
import {setRequestLocale} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing, baseUrl, landingPages, getLandingPageKeyBySlug, getLandingPageSlug} from '@/i18n/routing'
import type {Locale} from '@/i18n/routing'
import type {Metadata} from 'next'

export function generateStaticParams() {
  return Object.values(landingPages).flatMap((slugs) => routing.locales.map((locale) => ({locale, landingSlug: slugs[locale]})))
}

export async function generateMetadata({params}: PageProps<'/[locale]/[landingSlug]'>): Promise<Metadata> {
  const {locale, landingSlug} = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const key = getLandingPageKeyBySlug(landingSlug, locale as Locale)
  if (!key) notFound()

  const content = await getLandingPageContent(key, locale as Locale)
  const deSlug = getLandingPageSlug(key, 'de')
  const enSlug = getLandingPageSlug(key, 'en')

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/${landingSlug}`,
      languages: {
        de: `${baseUrl}/de/${deSlug}`,
        en: `${baseUrl}/en/${enSlug}`,
        'x-default': `${baseUrl}/de/${deSlug}`,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: `${baseUrl}/${locale}/${landingSlug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function LandingPage({params}: PageProps<'/[locale]/[landingSlug]'>) {
  const {locale, landingSlug} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const key = getLandingPageKeyBySlug(landingSlug, locale as Locale)
  if (!key) notFound()

  const content = await getLandingPageContent(key, locale as Locale)

  return (
    <main>
      <HeroSection withNav title={content.hero.title} description={content.hero.description} />
    </main>
  )
}
