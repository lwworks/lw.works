import { Brow } from '@/components/atoms/brow'
import { Heading } from '@/components/atoms/heading'
import { mdxComponents } from '@/components/mdx'
import { Section } from '@/components/sections'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import { getBlogPost, getBlogSlugs } from '@/content/blog/posts'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.flatMap((slug) => routing.locales.map((locale) => ({ locale, slug })))
}

export async function generateMetadata({ params }: PageProps<'/[locale]/blog/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const post = await getBlogPost(slug, locale as Locale)
  if (!post) notFound()

  const { frontmatter } = post

  return {
    title: `${frontmatter.title} — LW Works GmbH`,
    description: frontmatter.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
      languages: {
        de: `${baseUrl}/de/blog/${slug}`,
        en: `${baseUrl}/en/blog/${slug}`,
        'x-default': `${baseUrl}/de/blog/${slug}`
      }
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${baseUrl}/${locale}/blog/${slug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US',
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author]
    }
  }
}

export default async function BlogArticlePage({ params }: PageProps<'/[locale]/blog/[slug]'>) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const post = await getBlogPost(slug, locale as Locale)
  if (!post) notFound()

  const { frontmatter } = post

  const formattedDate = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(frontmatter.date))

  return (
    <main className="pt-16">
      <Section>
        <Brow className="mb-4">{formattedDate}</Brow>
        <Heading as="h1">{frontmatter.title}</Heading>
        <p className="mt-4 max-w-xl text-muted-foreground">{frontmatter.description}</p>
      </Section>
      <Section>
        <article>
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>
      </Section>
    </main>
  )
}
