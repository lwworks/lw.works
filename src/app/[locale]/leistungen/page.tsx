import {HeroSection} from '@/components/sections/hero'
import {getServicesContent} from '@/content/pages/services'
import {hasLocale} from 'next-intl'
import {setRequestLocale} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing, baseUrl} from '@/i18n/routing'
import type {Locale} from '@/i18n/routing'
import type {Metadata} from 'next'

export async function generateMetadata({params}: PageProps<'/[locale]/leistungen'>): Promise<Metadata> {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const content = await getServicesContent(locale as Locale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: locale === 'de' ? `${baseUrl}/de/leistungen` : `${baseUrl}/en/services`,
      languages: {
        de: `${baseUrl}/de/leistungen`,
        en: `${baseUrl}/en/services`,
        'x-default': `${baseUrl}/de/leistungen`,
      },
    },
    openGraph: {
      title: content.metadata.title,
      description: content.metadata.description,
      url: locale === 'de' ? `${baseUrl}/de/leistungen` : `${baseUrl}/en/services`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function ServicesPage({params}: PageProps<'/[locale]/leistungen'>) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const content = await getServicesContent(locale as Locale)

  return (
    <main>
      <HeroSection withNav title={content.hero.title} description={content.hero.description} />
    </main>
  )
}
