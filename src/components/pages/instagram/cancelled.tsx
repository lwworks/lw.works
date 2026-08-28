import { Heading } from '@/components/atoms/heading'
import { Main } from '@/components/main'
import { Section } from '@/components/sections'
import { Button } from '@/components/ui/button'
import { ArrowUpRight } from '@mynaui/icons-react'
import Link from 'next/link'

export const InstagramCancelledPage = () => {
  return (
    <Main>
      <Section background="paint-3">
        <Heading as="h1" size="h2">Instagram-Verknüpfung abgebrochen</Heading>
        <p className="my-8">Die Verknüpfung deines Instagram-Accounts wurde abgebrochen. Falls du die Verknüpfung weiterhin herstellen möchtest, versuche es bitte erneut.</p>
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