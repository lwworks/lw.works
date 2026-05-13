import { TeamMemberPage } from '@/components/pages/team-member'
import {
  getAllTeamMemberSlugs,
  getTeamMemberKeyBySlug,
  getTeamMemberSlug,
  loadTeamMemberContent
} from '@/content/contact'
import type { Locale } from '@/i18n/routing'
import { routing } from '@/i18n/routing'
import { getTeamMemberUrl } from '@/lib/routes/contact'
import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllTeamMemberSlugs(locale as Locale).map((member) => ({ locale, member }))
  )
}

export async function generateMetadata({ params }: PageProps<'/[locale]/contact/[member]'>): Promise<Metadata> {
  const { locale, member: memberSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const typedLocale = locale as Locale
  const memberKey = getTeamMemberKeyBySlug(memberSlug, typedLocale)
  if (!memberKey) notFound()

  const content = await loadTeamMemberContent(memberSlug, typedLocale)
  if (!content) notFound()

  const canonicalSlug = getTeamMemberSlug(memberKey, typedLocale)
  const deSlug = getTeamMemberSlug(memberKey, 'de')
  const enSlug = getTeamMemberSlug(memberKey, 'en')

  return {
    title: content.metadata.title,
    description: content.metadata.description,
    alternates: {
      canonical: getTeamMemberUrl(canonicalSlug, typedLocale),
      languages: {
        de: getTeamMemberUrl(deSlug, 'de'),
        en: getTeamMemberUrl(enSlug, 'en'),
        'x-default': getTeamMemberUrl(deSlug, 'de')
      }
    },
    openGraph: {
      title: content.metadata.title!,
      description: content.metadata.description!,
      url: getTeamMemberUrl(canonicalSlug, typedLocale),
      locale: locale === 'de' ? 'de_DE' : 'en_US'
    }
  }
}

export default async function TeamMemberBookingPage({ params }: PageProps<'/[locale]/contact/[member]'>) {
  const { locale, member: memberSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)

  const content = await loadTeamMemberContent(memberSlug, locale as Locale)
  if (!content) notFound()

  return <TeamMemberPage content={content} />
}
