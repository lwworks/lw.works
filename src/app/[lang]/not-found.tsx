'use client'

import './globals.css'
import {Locale} from '@/i18n.config'
import {Heading} from '@/components/atoms/heading'
import {Paragraph} from '@/components/atoms/paragraph'
import {Subheading} from '@/components/atoms/subheading'
import {Section} from '@/components/layout/section'
import {usePathname} from 'next/navigation'
import {Card} from '@/components/atoms/card'
import Image from 'next/image'
import Link from 'next/link'
import {Navigation} from '@/components/layout/navigation'

const dictionary = {
  en: {
    heading: 'Page not found',
    text: 'The page you are looking for does not exist. Maybe you have a typo in the URL? Otherwise, you may find what you were looking for here:',
    cards: [
      {
        href: '/',
        heading: 'Frontend Subscription',
        text: 'The first ever design and development subscription for SaaS companies.',
        image: '/images/not-found/frontend-subscription.png'
      },
      {
        href: '/work',
        heading: 'Recent Work',
        text: 'Have a look at what we&apos;ve designed and built for our clients.',
        image: '/images/not-found/recent-work.png'
      },
      {
        href: '/hardware',
        heading: 'Hardware',
        text: 'Bring great design into your everyday life with our hardware products.',
        image: '/images/not-found/hardware.png'
      }
    ]
  },
  de: {
    heading: 'Seite nicht gefunden',
    text: 'Die Seite, die du gesucht hast, existiert nicht. Vielleicht hast Du einen Tippfehler in der URL? Ansonsten findest du hier vielleicht, was du gesucht hast:',
    cards: [
      {
        href: '/',
        heading: 'Frontend Subscription',
        text: 'Das erste Design & Development Abo für SaaS Unternehmen.',
        image: '/images/not-found/frontend-subscription.png'
      },
      {
        href: '/work',
        heading: 'Recent Work',
        text: 'Schau dir an, was wir für unsere Kunden designed und gebaut haben.',
        image: '/images/not-found/recent-work.png'
      },
      {
        href: '/hardware',
        heading: 'Hardware',
        text: 'Bring mit unseren Hardware-Produkten großartiges Design in deinen Alltag.',
        image: '/images/not-found/hardware.png'
      }
    ]
  }
}

export default function Page() {
  const lang = usePathname()!.split('/')[1]

  return (
    <>
      <Navigation />
      <div className="relative">
        <main>
          <Section className="pt-32 pb-24 lg:py-48">
            <Subheading>Error 404</Subheading>
            <Heading level={1} html={dictionary[lang as Locale].heading} />
            <Paragraph size="lg" className="mt-12 max-w-lg" html={dictionary[lang as Locale].text} />
            <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
              {dictionary[lang as Locale].cards.map(({href, heading, text, image}, index) => (
                <Link key={index} href={href}>
                  <Card className="group relative h-full flex flex-col justify-between overflow-hidden px-6 pt-8 lg:p-12 lg:pb-0">
                    <div
                      className="absolute left-12 right-12 h-12 -bottom-6 blur-3xl bg-indigo-500 opacity-70 transition-opacity duration-300 group-hover:opacity-90"
                      style={{borderRadius: '50% 50%', transform: 'translate3d(0, 0, 0)'}}
                    />
                    <Heading level={2} size="sm">
                      {heading}
                    </Heading>
                    <Paragraph className="mt-4 mb-6" html={text} />
                    <div className="relative w-full aspect-square">
                      <Image src={image} alt={heading} fill className="group-hover:scale-[1.02] transition-transform duration-300" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Section>
        </main>
      </div>
    </>
  )
}
