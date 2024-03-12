import {Heading} from '@/components/atoms/heading'
import {Section} from '@/components/layout/section'
import {Locale} from '@/i18n.config'
import {Metadata} from 'next'
import {allProfiles} from 'contentlayer/generated'
import {notFound} from 'next/navigation'
import Image from 'next/image'
import {Icon} from '@/components/icons'
import Link from 'next/link'
import {Button} from '@/components/atoms/button'

export async function generateStaticParams() {
  return allProfiles.map((profile) => ({
    slug: profile.slug
  }))
}

export async function generateMetadata({params: {lang, slug}}: {params: {lang: Locale; slug: string}}): Promise<Metadata> {
  const profile = allProfiles.find((profile) => profile.slug === slug && profile.language === lang)
  if (!profile) notFound()
  return {
    title: `${profile.firstname} ${profile.lastname} – LW Works`,
    description: `${profile.description} @ LW Works GmbH`
  }
}

export default async function Page({params: {lang, slug}}: {params: {lang: Locale; slug: string}}) {
  const profile = allProfiles.find((profile) => profile.slug === slug && profile.language === lang)
  if (!profile) notFound()

  return (
    <main>
      <Section className="pt-32 pb-24 lg:py-48 min-h-screen flex flex-col items-center">
        <div className="flex flex-col gap-16 w-full max-w-md sm:max-w-sm">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-black dark:border-white">
              <Image src={profile.avatar} alt={`${profile.firstname} ${profile.lastname}`} fill placeholder="blur" blurDataURL={profile.avatar} />
            </div>
            <div>
              <Heading level={1} size="lg">
                {`${profile.firstname} ${profile.lastname}`}
              </Heading>
              <p className="text-xl">{profile.description}</p>
            </div>
          </div>
          <ul className="text-lg space-y-4 leading-snug not-sr-only">
            <li className="flex gap-4">
              <Icon name="house" className="h-5 text-black mt-0.5" />
              <span>
                <span className="text-black font-semibold">LW Works GmbH</span>
                <br />
                Mühlenbruchsweg 5, 27432 Oerel
              </span>
            </li>
            <li className="flex gap-4">
              <Icon name="send" className="h-5 text-black mt-0.5" />
              <Link href={`mailto:${profile.email}`} className="hover:text-black hover:underline">
                {profile.email}
              </Link>
            </li>
            <li className="flex gap-4">
              <Icon name="phone" className="h-5 text-black mt-0.5" />
              <Link href={`tel:${profile.phone}`} className="hover:text-black hover:underline">
                {profile.phone}
              </Link>
            </li>
          </ul>
          <div className="w-full flex flex-col">
            <div className="grid grid-cols-4 mb-2 gap-2">
              {profile.whatsapp && (
                <Button href={`https://wa.me/${profile.whatsapp}`} hideArrow secondary>
                  <Icon name="whatsapp" className="h-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              )}
              {profile.twitter && (
                <Button href={profile.twitter} hideArrow secondary>
                  <Icon name="twitter" className="h-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              )}
              {profile.linkedin && (
                <Button href={profile.linkedin} hideArrow secondary>
                  <Icon name="linkedin" className="h-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              )}
              {profile.calendar && (
                <Button href={profile.calendar} hideArrow secondary>
                  <Icon name="calendar-solid" className="h-4" />
                  <span className="sr-only">LinkedIn</span>
                </Button>
              )}
            </div>
            <Button href={`/contact/${profile.slug}/vcard`}>Kontakt speichern</Button>
          </div>
        </div>
        <div className="mt-24 grid max-w-xl grid-cols-1 gap-16 md:max-w-none md:grid-cols-2"></div>
      </Section>
    </main>
  )
}
