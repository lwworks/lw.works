import {hasLocale} from 'next-intl'
import {setRequestLocale} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing, baseUrl} from '@/i18n/routing'
import type {Locale} from '@/i18n/routing'
import type {Metadata} from 'next'

const titles: Record<Locale, string> = {
  de: 'Blog',
  en: 'Blog',
}

export async function generateMetadata({params}: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return {
    title: titles[locale as Locale],
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        de: `${baseUrl}/de/blog`,
        en: `${baseUrl}/en/blog`,
        'x-default': `${baseUrl}/de/blog`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${locale}/blog`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function BlogIndex({params}: PageProps<'/[locale]/blog'>) {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <main>
      <h1>{titles[locale as Locale]}</h1>
    </main>
  )
}
