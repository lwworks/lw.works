import {Heading} from '@/components/atoms/heading'
import {Section} from '@/components/layout/section'
import {getDictionary} from '@/utils/get-dictionary'
import {Locale} from '@/i18n.config'
import {allProjects} from 'contentlayer/generated'
import {Project} from '@/components/content/project'
import {Paragraph} from '@/components/atoms/paragraph'
import {CTA} from '@/components/sections/cta'
import {Metadata} from 'next'

export async function generateMetadata({params: {lang}}: {params: {lang: Locale}}): Promise<Metadata> {
  const dictionary = await getDictionary(lang)
  return dictionary.work.meta
}

export default async function Page({params}: {params: {lang: Locale}}) {
  const dictionary = await getDictionary(params.lang)

  return (
    <main>
      <Section className="pt-32 lg:pt-48">
        <Heading level={1}>{dictionary.work.heading}</Heading>
        <Paragraph size="lg" className="mt-7 max-w-sm" html={dictionary.work.text} />
      </Section>
      {allProjects
        .filter((post) => post.language === params.lang)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((project, index) => (
          <Project key={index} project={project} reverse={index % 2 === 0} hideDivider={index === 0} />
        ))}
      <CTA content={dictionary.work.cta} hideGlow />
    </main>
  )
}
