import { Heading } from '@/components/atoms/heading'
import type { BlogPost } from '@/content/blog/posts'
import type { Locale } from '@/i18n/routing'
import { NextIntlLink } from '@/i18n/navigation'

export const BlogCard = ({ post, locale }: { post: BlogPost; locale: Locale }) => {
  const formattedDate = new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(post.frontmatter.date))

  return (
    <NextIntlLink
      href={`/blog/${post.slug}` as never}
      className="group block"
    >
      <p className="font-mono text-xs uppercase text-muted-foreground">{formattedDate}</p>
      <Heading as="h3" className="mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {post.frontmatter.title}
      </Heading>
      <p className="mt-2 text-muted-foreground line-clamp-2">{post.frontmatter.description}</p>
    </NextIntlLink>
  )
}
