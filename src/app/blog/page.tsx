import { Brow } from '@/components/atoms/brow'
import { Heading } from '@/components/atoms/heading'
import { BlogCard } from '@/components/blog/blog-card'
import { Section } from '@/components/sections'
import { getBlogPosts } from '@/lib/blog/posts'
import { baseUrl } from '@/lib/site'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — LW Works GmbH',
  description: 'Artikel und Insights rund um Webentwicklung, Design und digitale Strategien für Unternehmen.',
  alternates: {
    canonical: `${baseUrl}/blog`,
  },
  openGraph: {
    title: 'Blog — LW Works GmbH',
    description: 'Artikel und Insights rund um Webentwicklung, Design und digitale Strategien für Unternehmen.',
    url: `${baseUrl}/blog`,
    locale: 'de_DE',
  },
}

export default async function BlogListingPage() {
  const posts = await getBlogPosts()

  return (
    <main className="pt-16">
      <Section>
        <Brow className="mb-4">Blog</Brow>
        <Heading as="h1">Artikel & Insights</Heading>
        <p className="mt-4 max-w-xl text-muted-foreground">Gedanken zu Webentwicklung, Design und digitalem Wachstum.</p>
        <div className="mt-12 space-y-10">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
    </main>
  )
}
