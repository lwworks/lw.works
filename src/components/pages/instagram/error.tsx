import { Heading } from '@/components/atoms/heading'
import { Main } from '@/components/main'
import { Section } from '@/components/sections'
import Link from 'next/link'

export const InstagramErrorPage = () => {
  return (
    <Main>
      <Section background="paint-3">
        <Heading as="h1" size="h2">Fehler bei der Instagram-Verknüpfung</Heading>
        <p className="mt-8">Beim Verknüpfen deines Instagram-Accounts ist ein Fehler aufgetreten. Bitte prüfe, ob dein Account ein öffentliches Business- oder Creator-Profil ist und ob er nicht eventuell bereits verknüpft ist.</p>
        <p className="mt-4">
          <Link className="text-black dark:text-white underline" href="/integrations/instagram">Klicke hier</Link>, um es erneut zu versuchen.
        </p>
        <p className="mt-4">Wenn du alles geprüft hast und der Fehler weiterhin auftritt, kontaktiere uns bitte per Email.</p>
      </Section>
    </Main>
  )
}