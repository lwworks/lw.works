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
import {Navigation} from '@/components/layout/navigation'
import {getDictionary} from '@/utils/get-dictionary'
import {MDX} from '@/components/content/mdx'

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
  const dictionary = await getDictionary(lang)

  return (
    <>
      <Navigation />
      <div className="relative">
        <main>
          <Section className="pt-32 pb-24 lg:py-48 min-h-screen flex flex-col items-center">
            <div className="flex flex-col gap-12 w-full max-w-md sm:max-w-sm">
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-black dark:border-white">
                  <Image src={profile.avatar} alt={`${profile.firstname} ${profile.lastname}`} fill placeholder="blur" blurDataURL={profile.avatar} />
                </div>
                <div>
                  <Heading level={1} size="lg">
                    {`${profile.firstname} ${profile.lastname}`}
                  </Heading>
                  <p className="text-lg text-slate-700 dark:text-slate-300">{profile.description}</p>
                </div>
              </div>
              <MDX code={profile.body.code} />
              <div className="w-full flex flex-col gap-2">
                <Button href={`/contact/${profile.slug}/vcard`}>{dictionary.contact.storeContact}</Button>
                <div className="grid grid-cols-2 gap-2">
                  {profile.email && (
                    <Button href={`mailto:${profile.email}`} hideArrow secondary>
                      <span className="flex items-center gap-3">
                        <Icon name="email-solid" className="h-3.5" />
                        <span>{dictionary.contact.email}</span>
                      </span>
                    </Button>
                  )}
                  {profile.phone && (
                    <Button href={`tel:${profile.phone}`} hideArrow secondary>
                      <span className="flex items-center gap-3">
                        <Icon name="phone" className="h-3.5" />
                        <span>{dictionary.contact.call}</span>
                      </span>
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {profile.whatsapp && (
                    <Button href={`https://wa.me/${profile.whatsapp}`} hideArrow secondary>
                      <Icon name="whatsapp" className="h-4" />
                      <span className="sr-only">WhatsApp</span>
                    </Button>
                  )}
                  {profile.twitter && (
                    <Button href={profile.twitter} hideArrow secondary>
                      <Icon name="twitter" className="h-4" />
                      <span className="sr-only">Twitter</span>
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
                      <span className="sr-only">Calendar</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-24 grid max-w-xl grid-cols-1 gap-16 md:max-w-none md:grid-cols-2"></div>
          </Section>
        </main>
      </div>
    </>
  )
}
