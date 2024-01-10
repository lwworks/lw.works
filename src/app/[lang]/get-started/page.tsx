import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/atoms/paragraph'
import {Author} from '@/components/content/author'
import {MDX} from '@/components/content/mdx'
import {TOC} from '@/components/content/toc'
import {Section} from '@/components/layout/section'
import {Locale} from '@/i18n.config'
import {getDictionary} from '@/utils/get-dictionary'
import {allTextPages} from 'contentlayer/generated'
import {Metadata} from 'next'
import {notFound} from 'next/navigation'

export async function generateMetadata({params: {lang}}: {params: {lang: Locale}}): Promise<Metadata> {
  const dictionary = await getDictionary(lang)
  return {
    ...dictionary.getStarted.meta
  }
}

export default async function Page({params: {lang}}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(lang)

  return (
    <main>
      <Section className="pt-32 pb-24 lg:py-48">
        <Heading level={1}>{dictionary.getStarted.heading}</Heading>
        <Paragraph size="lg" className="mt-7 max-w-md mb-16" html={dictionary.getStarted.text} />
        <Author {...dictionary.getStarted.contact} />
      </Section>
    </main>
  )
}
