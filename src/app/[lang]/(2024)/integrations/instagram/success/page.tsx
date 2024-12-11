import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Locale} from '@/i18n.config'
import {notFound} from 'next/navigation'

const dictionary = (username?: string) => ({
  de: {
    heading: 'Instagram-Verknüpfung erfolgreich',
    text: (
      <>
        <span>Danke! Dein Instagram-Account </span>
        <span className="text-black dark:text-white font-semibold">@{username ?? ''}</span>
        <span> ist jetzt mit unserer Datenbank verknüpft, sodass wir ihn auf deiner Website und in Automationen einbinden können.</span>
      </>
    )
  },
  en: {
    heading: 'Instagram connection successful',
    text: (
      <>
        <span>Thanks! Your Instagram account </span>
        <span className="text-black dark:text-white font-semibold">@{username ?? ''}</span>
        <span> is now connected to our database and ready to be used on your website and in automations.</span>
      </>
    )
  }
})

export const generateMetadata = ({params}: {params: {lang: Locale}}) => {
  return {
    title: dictionary()[params.lang].heading
  }
}

export default function Page({params, searchParams}: {params: {lang: Locale}; searchParams: {[key: string]: string | string[] | undefined}}) {
  if (!searchParams['username']) notFound()
  const content = dictionary(searchParams['username'] as string)[params.lang]

  return (
    <>
      <Header lang={params.lang} />
      <main className="relative px-4 max-w-2xl mx-auto">
        <Heading level={3}>{content.heading}</Heading>
        <Paragraph className="mt-8">{content.text}</Paragraph>
      </main>
    </>
  )
}
