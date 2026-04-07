import { TeamMemberPage } from '@/components/pages/team-member'
import { getAllTeamMemberSlugs, loadTeamMemberContent } from '@/content/contact'
import type { Locale } from '@/i18n/routing'
import { baseUrl, routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  const slugs = getAllTeamMemberSlugs()
  return slugs.flatMap((member) =>
    routing.locales.map((locale) => ({ locale, member }))
  )
}

export async function generateMetadata({ params }: PageProps<'/[locale]/kontakt/[member]'>): Promise<Metadata> {
  const { locale, member: memberSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const content = await loadTeamMemberContent(memberSlug, locale as Locale)
  if (!content) notFound()

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: `${baseUrl}/${locale}/kontakt/${memberSlug}`,
      languages: {
        de: `${baseUrl}/de/kontakt/${memberSlug}`,
        en: `${baseUrl}/en/contact/${memberSlug}`,
        'x-default': `${baseUrl}/de/kontakt/${memberSlug}`
      }
    },
    openGraph: {
      title: content.metadata.title!,
      description: content.metadata.description!,
      url: `${baseUrl}/${locale}/kontakt/${memberSlug}`,
      locale: locale === 'de' ? 'de_DE' : 'en_US'
    }
  }
}

export default async function TeamMemberBookingPage({ params }: PageProps<'/[locale]/kontakt/[member]'>) {
  const { locale, member: memberSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const content = await loadTeamMemberContent(memberSlug, locale as Locale)
  if (!content) notFound()

  return <TeamMemberPage content={content} />
}
