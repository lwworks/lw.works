import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import type { Locale } from '@/i18n/locale'

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
  locale: Locale
  frontmatter: BlogFrontmatter
  content: string
}

export async function getBlogSlugs(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true })
  return entries.filter((e) => e.isDirectory()).map((e) => e.name)
}

export async function getBlogPost(slug: string, locale: Locale): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, slug, `${locale}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    return {
      slug,
      locale,
      frontmatter: data as BlogFrontmatter,
      content
    }
  } catch {
    return null
  }
}

export async function getBlogPosts(locale: Locale): Promise<BlogPost[]> {
  const slugs = await getBlogSlugs()
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(slug, locale)))
  return posts
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}
