import {hasLocale} from 'next-intl'
import {setRequestLocale, getTranslations} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing, baseUrl} from '@/i18n/routing'
import type {Metadata} from 'next'

export async function generateMetadata({params}: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const {locale} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const t = await getTranslations({locale, namespace: 'blog'})

  return {
    title: t('title'),
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
  const t = await getTranslations('blog')

  return (
    <main>
      <h1>{t('title')}</h1>
    </main>
  )
}
