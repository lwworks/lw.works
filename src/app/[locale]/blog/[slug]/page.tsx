import {hasLocale} from 'next-intl'
import {setRequestLocale} from 'next-intl/server'
import {notFound} from 'next/navigation'
import {routing, baseUrl} from '@/i18n/routing'
import type {Metadata} from 'next'

export async function generateMetadata({params}: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const {locale, slug} = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  return {
    title: slug,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        de: `${baseUrl}/de/blog/${slug}`,
        en: `${baseUrl}/en/blog/${slug}`,
        'x-default': `${baseUrl}/de/blog/${slug}`,
      },
    },
    openGraph: {
      url: `${baseUrl}/${locale}/blog/${slug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
    },
  }
}

export default async function BlogPost({params}: PageProps<'/[locale]/blog/[slug]'>) {
  const {locale, slug} = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  return (
    <main>
      <article>
        <h1>{slug}</h1>
      </article>
    </main>
  )
}
