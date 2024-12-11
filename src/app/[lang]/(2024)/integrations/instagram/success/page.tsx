import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Locale} from '@/i18n.config'
import Link from 'next/link'
import {notFound} from 'next/navigation'

const dictionary = (username?: string) => ({
  de: {
    heading: 'Instagram-Verknüpfung erfolgreich',
    paragraphs: [
      <>
        <span>Danke! Dein Instagram-Account </span>
        <Link href={`https://instagram.com/${username}`} className="text-black dark:text-white font-semibold">
          @{username ?? ''}
        </Link>
        <span> ist jetzt mit unserer Datenbank verknüpft, sodass wir ihn auf deiner Website und in Automationen einbinden können.</span>
      </>,
      <>
        <span>Um einen weiteren Account zu verknüpfen, </span>
        <Link className="text-black dark:text-white font-semibold" href="/integrations/instagram">
          klicke hier
        </Link>
        <span>.</span>
      </>
    ]
  },
  en: {
    heading: 'Instagram connection successful',
    paragraphs: [
      <>
        <span>Thanks! Your Instagram account </span>
        <Link href={`https://instagram.com/${username}`} className="text-black dark:text-white font-semibold">
          @{username ?? ''}
        </Link>
        <span> is now connected to our database and ready to be used on your website and in automations.</span>
      </>,
      <>
        <Link className="text-black dark:text-white font-semibold" href="/integrations/instagram">
          Click here
        </Link>
        <span> to connect another account.</span>
      </>
    ]
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
        {content.paragraphs.map((paragraph, index) => (
          <Paragraph key={index} className={index === 0 ? 'mt-8' : 'mt-4'}>
            {paragraph}
          </Paragraph>
        ))}
      </main>
    </>
  )
}
