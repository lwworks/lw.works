import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Locale} from '@/i18n.config'
import {ArrowUpRightIcon} from '@heroicons/react/16/solid'
import Link from 'next/link'

const dictionary = {
  de: {
    heading: 'Instagram-Account verknüpfen',
    text: 'Damit wir deinen Instagram-Account auf deiner Website und in Automationen einbinden können, musst du ihn zunächst mit unserer Datenbank verknüpfen. Klicke auf den Button, um den Verknüpfungsprozess zu starten. Du wirst zu Instagram weitergeleitet, um dich einzuloggen und die Verknüpfung zu autorisieren. Keine Sorge: wir erhalten dabei zu keinem Zeitpunkt Zugriff auf dein Passwort.',
    cta: 'Instagram-Account verknüpfen'
  },
  en: {
    heading: 'Connect Instagram account',
    text: 'You need to connect your Instagram account to our database before we can use it on your website and in automations. Click the button to start the connection process. You will be redirected to Instagram to log in and authorize the connection. Rest assured, we will not gain access to your password at any point.',
    cta: 'Connect Instagram account'
  }
}

export const generateMetadata = ({params}: {params: {lang: Locale}}) => {
  return {
    title: dictionary[params.lang].heading
  }
}

export default function Page({params}: {params: {lang: Locale}}) {
  const content = dictionary[params.lang]

  return (
    <>
      <Header lang={params.lang} />
      <main className="relative px-4 max-w-2xl mx-auto">
        <Heading level={3}>{content.heading}</Heading>
        <Paragraph className="mt-8">{content.text}</Paragraph>
        <Link
          className="group mt-10 inline-block h-9 rounded-full p-px bg-gradient-to-b from-neutral-500 to-neutral-900 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
          href={`https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=https://lw.works/api/instagram/login&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`}
        >
          <div className="flex h-full items-center justify-center gap-1 px-4 rounded-full bg-black font-semibold text-white group-hover:bg-neutral-800">
            <span>{content.cta}</span>
            <ArrowUpRightIcon className="size-4 text-neutral-400" />
          </div>
        </Link>
      </main>
    </>
  )
}
