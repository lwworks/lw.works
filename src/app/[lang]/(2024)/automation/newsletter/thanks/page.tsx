import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Locale} from '@/i18n.config'
import {notFound} from 'next/navigation'

const dictionary = (name: string, email: string) => ({
  de: {
    heading: `Danke, ${name}!`,
    text: `Du kannst Dich auf einige spannende Einblicke in das Thema Automatisierung freuen. Wir senden dir regelmäßig Ideen und aktuelle Stories an ${email}.`
  },
  en: {
    heading: `Thanks, ${name}!`,
    text: `You can look forward to some exciting insights into the topic of automation. We will regularly send you ideas and current stories to ${email}.`
  }
})

export default function Page({params, searchParams}: {params: {lang: Locale}; searchParams: {[key: string]: string | string[] | undefined}}) {
  if (!searchParams['name'] || !searchParams['email']) notFound()
  const content = dictionary(searchParams['name'] as string, searchParams['email'] as string)[params.lang]

  return (
    <>
      <Header lang={params.lang} />
      <main className="relative px-4 max-w-2xl mx-auto">
        <Heading level={2}>{content.heading}</Heading>
        <Paragraph className="mt-8">{content.text}</Paragraph>
      </main>
    </>
  )
}
