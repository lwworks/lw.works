import {Paragraph} from '@/components/2024/atoms/paragraph'
import {Header} from '@/components/2024/header'
import {Heading} from '@/components/atoms/heading'
import {Locale} from '@/i18n.config'
import {ArrowUpRightIcon} from '@heroicons/react/16/solid'
import Link from 'next/link'

const dictionary = {
  de: {
    heading: 'Instagram-Account verknüpfen',
    cta: 'Instagram-Account verknüpfen'
  },
  en: {
    heading: 'Connect Instagram account',
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
      <main className="relative px-4 max-w-2xl mx-auto pb-16">
        <Heading level={1} size="md">
          {content.heading}
        </Heading>
        <Heading level={2} size="xs" className="mt-8">
          {params.lang === 'de' ? '1. Voraussetzungen' : '1. Prerequisites'}
        </Heading>
        <Paragraph className="mt-4">
          {params.lang === 'de'
            ? 'Dein Instagram-Account muss ein Business- oder Creator-Account sein. Wenn das nicht der Fall ist, wird Instagram dich nach der Anmeldung auffordern, deinen Account umzustellen.'
            : 'Your Instagram account must be a Business or Creator account. If it is not, Instagram will ask you to switch your account type after logging in.'}
        </Paragraph>
        <Heading level={2} size="xs" className="mt-8">
          {params.lang === 'de' ? '2. Einladung annehmen' : '2. Accept invitation'}
        </Heading>
        <Paragraph className="mt-4">
          {params.lang === 'de' ? (
            <>
              <span>Damit du deinen Account mit unserer Datenbank verknüpfen kannst, müssen wir dich zunächst einladen. In deinen </span>
              <Link className="text-black dark:text-white font-semibold" href="https://www.instagram.com/accounts/manage_access/" target="_blank">
                Instagram-Einstellungen
              </Link>
              <span>
                <span> musst du diese Einladung annehmen. Klicke unter </span>
                <span className="text-black dark:text-white">Website-Berechtigungen/Apps und Websites</span>
                <span> auf </span>
                <span className="text-black dark:text-white">Tester-Einladungen</span>
                <span> und dann auf </span>
                <span className="text-black dark:text-white">Akzeptieren</span>
                <span>. Im Video siehst Du noch einmal, wie das geht.</span>
              </span>
            </>
          ) : (
            <>
              <span>In order to connect your account with our database, we first need to invite you. You need to accept this invitation in your </span>
              <Link className="text-black dark:text-white font-semibold" href="https://www.instagram.com/accounts/manage_access/" target="_blank">
                Instagram settings
              </Link>
              <span>. The video below shows you how to do this.</span>
            </>
          )}
        </Paragraph>
        <iframe
          src="https://www.youtube-nocookie.com/embed/4uyIz3Hg6-M?si=GJDNuXECt9246tf-"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="mt-4 shadow-lg w-full aspect-video rounded-xl overflow-hidden"
        />
        <Heading level={2} size="xs" className="mt-8">
          {params.lang === 'de' ? '3. Account verknüpfen' : '3. Connect account'}
        </Heading>
        <Paragraph className="mt-4">
          {params.lang === 'de'
            ? 'Nun musst du deinen Instagram-Account noch mit unserer Schnittstelle verknüpfen. Klicke auf den Button, um den Verknüpfungsprozess zu starten. Du wirst zu Instagram weitergeleitet, um dich einzuloggen und die Verknüpfung zu autorisieren.  '
            : 'Now you need to connect your Instagram account with our interface. Click the button to start the connection process. You will be redirected to Instagram to log in and authorize the connection.'}
        </Paragraph>
        <Link
          className="group mt-10 inline-block h-9 rounded-full p-px bg-gradient-to-b from-neutral-500 to-neutral-900 dark:from-white dark:to-neutral-100 hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-400"
          href={`https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=https://lw.works/api/instagram/login&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`}
        >
          <div className="flex h-full items-center justify-center gap-1 px-4 rounded-full bg-black dark:bg-neutral-100 font-semibold text-white dark:text-black group-hover:bg-neutral-800 dark:group-hover:bg-white">
            <span>{content.cta}</span>
            <ArrowUpRightIcon className="size-4 text-neutral-400" />
          </div>
        </Link>
      </main>
    </>
  )
}
