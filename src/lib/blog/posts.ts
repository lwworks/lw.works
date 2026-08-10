import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export type BlogFrontmatter = {
  title: string
  description: string
  date: string
  author: string
  image?: string
  tags?: string[]
}

export type BlogPost = {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
}

export async function getBlogSlugs(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory()).map((e) => e.name)
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, slug, 'de.mdx')
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      frontmatter: data as BlogFrontmatter,
      content,
    }
  } catch {
    return null
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const slugs = await getBlogSlugs()
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(slug)))
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}
