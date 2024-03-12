import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/atoms/paragraph'
import {Author} from '@/components/content/author'
import {MDX} from '@/components/content/mdx'
import {TOC} from '@/components/content/toc'
import {ArrowIcon} from '@/components/icons/arrow'
import {CalendarIcon} from '@/components/icons/calendar'
import {Section} from '@/components/layout/section'
import {allBlogPosts} from 'contentlayer/generated'
import {Locale} from '@/i18n.config'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {Metadata} from 'next'

export async function generateStaticParams() {
  return allBlogPosts.map((post) => ({
    slug: post.slug
  }))
}

export async function generateMetadata({params: {lang, slug}}: {params: {lang: Locale; slug: string}}): Promise<Metadata> {
  const post = allBlogPosts.find((post) => post.slug === slug && post.language === lang)
  if (!post) notFound()
  return {
    title: `${post.title} – LW Works`,
    description: post.excerpt
  }
}

export default async function Page({params}: {params: {slug: string; lang: Locale}}) {
  const post = allBlogPosts.find((post) => post.slug === params.slug && post.language === params.lang)
  if (!post) notFound()

  return (
    <main>
      <Section className="pt-32 md:pt-40 lg:pt-48">
        <div className="mb-1 flex items-center space-x-4 font-mono uppercase text-indigo-500 dark:text-indigo-400 sm:mb-3">
          <Link
            href="/blog"
            className="group -mx-1.5 flex items-center space-x-1 rounded-sm px-1.5 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/10"
          >
            <ArrowIcon className="mb-0.5 w-0 rotate-180 text-black opacity-20 transition-all duration-200 group-hover:w-4 dark:text-white" />
            <span>Blog</span>
          </Link>
          <span className="text-black/20 dark:text-white/20">{'///'}</span>
        </div>
        <Heading level={1} className="max-w-4xl">
          {post.title}
        </Heading>
        <div className="mt-8 flex items-center space-x-2">
          <CalendarIcon className="h-5 text-indigo-500 dark:text-indigo-400" />
          <p className="font-semibold text-black dark:text-white">{post.writtenDate}</p>
        </div>
        <div className="mt-8 flex justify-between">
          <Paragraph size="lg" className="max-w-xl xl:max-w-2xl">
            {post.excerpt}
          </Paragraph>
          <div className="hidden lg:block lg:w-80">
            <Author {...post.author} />
          </div>
        </div>
        <div className="mt-8 lg:hidden">
          <Author {...post.author} />
        </div>
      </Section>
      <section className="relative mt-12 border-t border-slate-200 pt-12 pb-20 dark:border-slate-700 sm:pb-28 md:pb-32 lg:mt-16 lg:pt-16 lg:pb-40 xl:pb-48">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="mx-auto -mt-48 h-96 w-full max-w-screen-xl bg-[#F9FAFB] blur-3xl dark:bg-[#15191F] sm:blur-4xl"
            style={{borderRadius: '50% 50%', transform: 'translate3d(0, 0, 0)'}}
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-screen-xl items-start justify-between px-6 sm:px-8 lg:px-12" id="article">
          <MDX code={post.body.code} />
          <div className="sticky top-32 hidden lg:block lg:w-80" style={{maxHeight: 'calc(100vh - 400px)'}}>
            <TOC headings={post.headings} />
          </div>
        </div>
      </section>
    </main>
  )
}
