import { Heading } from "@/components/atoms/heading"
import { Main } from "@/components/main"
import { Section } from "@/components/sections"
import Link from "next/link"

export const InstagramSuccessPage = ({ username }: { username: string }) => {
  return (
    <Main>
      <Section background="paint-4">
        <Heading as="h1" size="h2">Instagram-Verknüpfung erfolgreich</Heading>
        <p className="mt-8">
          <span>Dein Instagram-Account </span>
          <Link href={`https://instagram.com/${username}`} className="text-black dark:text-white underline">
            @{username ?? ''}
          </Link>
          <span> ist jetzt mit unserer Datenbank verknüpft, sodass wir ihn auf deiner Website und in Automationen einbinden können.</span>
        </p>
        <p className="mt-4">
          Um einen weiteren Account zu verknüpfen, <Link className="text-black dark:text-white underline" href="/integrations/instagram">klicke hier</Link>.
        </p>
      </Section>
    </Main>
  )
}
