import Link from 'next/link'
import { Heading } from '@/components/atoms/heading'
import type { BlogPost } from '@/lib/blog/posts'

export const BlogCard = ({ post }: { post: BlogPost }) => {
  const formattedDate = new Intl.DateTimeFormat('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.frontmatter.date))

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <p className="font-mono text-xs uppercase text-muted-foreground">{formattedDate}</p>
      <Heading as="h3" className="mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {post.frontmatter.title}
      </Heading>
      <p className="mt-2 text-muted-foreground line-clamp-2">{post.frontmatter.description}</p>
    </Link>
  )
}
