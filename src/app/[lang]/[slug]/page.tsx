import {Heading} from '@/components/atoms/heading'
import {Author} from '@/components/content/author'
import {MDX} from '@/components/content/mdx'
import {TOC} from '@/components/content/toc'
import {Section} from '@/components/layout/section'
import {allBlogPosts, allTextPages} from 'contentlayer/generated'
import {notFound} from 'next/navigation'

export async function generateStaticParams() {
  return allTextPages.map((page) => ({
    slug: page.slug
  }))
}

export default async function Page({params}: {params: {lang: string; slug: string}}) {
  const page = allTextPages.find((page) => page.slug === params.slug && page.language === params.lang)
  if (!page) notFound()

  return (
    <main>
      <Section className="pt-32 md:pt-40 lg:pt-48">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <Heading level={1} className="max-w-4xl">
            {page.title}
          </Heading>
          <div className="md:-mt-2 lg:w-80">
            <Author {...page.contact} />
          </div>
        </div>
      </Section>
      <section className="relative mt-12 border-t border-slate-200 pt-12 pb-20 dark:border-slate-700 sm:pb-28 md:pb-32 lg:mt-16 lg:pt-16 lg:pb-40 xl:pb-48">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="mx-auto -mt-48 h-96 w-full max-w-screen-xl bg-[#F9FAFB] blur-3xl dark:bg-[#15191F] sm:blur-4xl"
            style={{borderRadius: '50% 50%'}}
          />
        </div>
        <div className="relative mx-auto flex w-full max-w-screen-xl items-start justify-between px-6 sm:px-8 lg:px-12" id="article">
          <MDX code={page.body.code} />
          <div className="sticky top-32 hidden lg:block lg:w-80 overflow-y-auto" style={{maxHeight: 'calc(100vh - 400px)'}}>
            <TOC headings={page.headings} />
          </div>
        </div>
      </section>
    </main>
  )
}
