import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Locale} from '@/i18n.config'
import {notFound} from 'next/navigation'

const dictionary = (name: string, email: string) => ({
  de: {
    heading: 'Abmeldung erfolgreich',
    text: `Danke, ${name}. Wir senden ab sofort keinen Automatisierungs-Newsletter mehr an ${email}.`
  },
  en: {
    heading: 'Unsubscribe successful',
    text: `Thanks, ${name}. We will no longer send the automation newsletter to ${email}.`
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
