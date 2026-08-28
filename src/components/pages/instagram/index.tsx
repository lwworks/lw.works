import { Heading } from '@/components/atoms/heading'
import { Main } from '@/components/main'
import { Section } from '@/components/sections'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from '@mynaui/icons-react'
import Link from 'next/link'

export const InstagramPage = () => {
  return (
    <Main>
      <Section background="paint-4">
        <Heading as="h1" className="mb-16">Instagram-Account verknüpfen</Heading>
        <Heading as="h2">1. Voraussetzungen</Heading>
        <p className="mt-4 mb-8">Dein Instagram-Account muss ein Business- oder Creator-Account sein. Wenn das nicht der Fall ist, wird Instagram dich nach der Anmeldung auffordern, deinen Account umzustellen.</p>
        <Heading as="h2">2. Einladung annehmen</Heading>
        <p className="mt-4">
          <span>Damit du deinen Account mit unserer Datenbank verknüpfen kannst, müssen wir dich zunächst einladen. In deinen </span>
          <Link className="text-black dark:text-white underline" href="https://www.instagram.com/accounts/manage_access/" target="_blank">
            Instagram-Einstellungen
          </Link>
          <span>
            <span> musst du diese Einladung annehmen. Klicke unter </span>
            <span className="text-black dark:text-white font-medium">Website-Berechtigungen/Apps und Websites</span>
            <span> auf </span>
            <span className="text-black dark:text-white font-medium">Tester-Einladungen</span>
            <span> und dann auf </span>
            <span className="text-black dark:text-white font-medium">Akzeptieren</span>
            <span>. Im Video siehst Du noch einmal, wie das geht.</span>
          </span>
        </p>
        <iframe
          src="https://www.youtube-nocookie.com/embed/4uyIz3Hg6-M?si=GJDNuXECt9246tf-"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="mt-8 shadow-lg w-full aspect-video rounded-xl overflow-hidden"
        />
        <Heading as="h2" className="mt-8">3. Account verknüpfen</Heading>
        <p className="mt-4 mb-8">Nun musst du deinen Instagram-Account noch mit unserer Schnittstelle verknüpfen. Klicke auf den Button, um den Verknüpfungsprozess zu starten. Du wirst zu Instagram weitergeleitet, um dich einzuloggen und die Verknüpfung zu autorisieren.</p>
        <Button asChild>
          <Link href={`https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID}&redirect_uri=https://lw.works/api/instagram/login&response_type=code&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish`}>
            <span>Instagram-Account verknüpfen</span>
            <ArrowUpRight className="size-4 opacity-50 shrink-0" />
          </Link>
        </Button>
      </Section>
    </Main>
  )
}