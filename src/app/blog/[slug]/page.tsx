import { Brow } from '@/components/atoms/brow'
import { Heading } from '@/components/atoms/heading'
import { mdxComponents } from '@/components/mdx'
import { Section } from '@/components/sections'
import { getBlogPost, getBlogSlugs } from '@/lib/blog/posts'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const slugs = await getBlogSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const { frontmatter } = post

  return {
    title: `${frontmatter.title} — LW Works GmbH`,
    description: frontmatter.description,
    alternates: {
      canonical: `${baseUrl}/blog/${slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      url: `${baseUrl}/blog/${slug}`,
      locale: 'de_DE',
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [frontmatter.author],
    },
  }
}

export default async function BlogArticlePage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getBlogPost(slug)
  if (!post) notFound()

  const { frontmatter } = post

  const formattedDate = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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
