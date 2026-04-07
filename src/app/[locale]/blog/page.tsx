import { Brow } from '@/components/atoms/brow'
import { Heading } from '@/components/atoms/heading'
import { BlogCard } from '@/components/blog/blog-card'
import { Section } from '@/components/sections'
import { getBlogListingContent } from '@/content/blog'
import { getBlogPosts } from '@/content/blog/posts'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog'>): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const content = getBlogListingContent(locale as Locale)

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        de: `${baseUrl}/de/blog`,
        en: `${baseUrl}/en/blog`,
        'x-default': `${baseUrl}/de/blog`
      }
    },
    openGraph: {
      title: content.metadata.title! as string,
      description: content.metadata.description! as string,
      url: `${baseUrl}/${locale}/blog`,
      locale: locale === 'de' ? 'de_DE' : 'en_US'
    }
  }
}

export default async function BlogListingPage({ params }: PageProps<'/[locale]/blog'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const content = getBlogListingContent(locale as Locale)
  const posts = await getBlogPosts(locale as Locale)

  return (
    <main className="pt-16">
      <Section>
        <Brow className="mb-4">{content.brow}</Brow>
        <Heading as="h1">{content.heading}</Heading>
        <p className="mt-4 max-w-xl text-muted-foreground">{content.description}</p>
        <div className="mt-12 space-y-10">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale as Locale} />
          ))}
        </div>
      </Section>
    </main>
  )
}
