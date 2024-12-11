import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Locale} from '@/i18n.config'
import Link from 'next/link'
import {notFound} from 'next/navigation'

const dictionary = {
  de: {
    heading: 'Fehler bei der Instagram-Verknüpfung',
    paragraphs: [
      'Beim Verknüpfen deines Instagram-Accounts ist ein Fehler aufgetreten. Bitte prüfe, ob dein Account ein öffentliches Business- oder Creator-Profil ist und ob er nicht eventuell bereits verknüpft ist.',
      <>
        <Link className="text-black dark:text-white font-semibold" href="/integrations/instagram">
          klicke hier
        </Link>
        <span>, um es erneut zu versuchen.</span>
      </>,
      'Wenn du alles geprüft hast und der Fehler weiterhin auftritt, kontaktiere uns bitte per Email.'
    ]
  },
  en: {
    heading: 'Error during Instagram connection',
    paragraphs: [
      'An error occurred while connecting your Instagram account. Please check if your account is a public business or creator profile and if it is not already connected.',
      <>
        <Link className="text-black dark:text-white font-semibold" href="/integrations/instagram">
          Click here
        </Link>
        <span> to try again.</span>
      </>,
      'If you have checked everything and the error persists, please contact us via email.'
    ]
  }
}

export const generateMetadata = ({params}: {params: {lang: Locale}}) => {
  return {
    title: dictionary[params.lang].heading
  }
}

export default function Page({params, searchParams}: {params: {lang: Locale}; searchParams: {[key: string]: string | string[] | undefined}}) {
  if (!searchParams['username']) notFound()
  const content = dictionary[params.lang]

  return (
    <>
      <Header lang={params.lang} />
      <main className="relative px-4 max-w-2xl mx-auto">
        <Heading level={3}>{content.heading}</Heading>
        {content.paragraphs.map((paragraph, index) => (
          <Paragraph key={index} className={index === 0 ? 'mt-8' : 'mt-4'}>
            {paragraph}
          </Paragraph>
        ))}
      </main>
    </>
  )
}
