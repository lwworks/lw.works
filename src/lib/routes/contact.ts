import { getPathname } from '@/i18n/navigation'
import { baseUrl, type Locale } from '@/i18n/routing'

type TeamMemberHref = {
  pathname: '/contact/[member]'
  params: { member: string }
}

export const getTeamMemberHref = (memberSlug: string): TeamMemberHref => ({
  pathname: '/contact/[member]',
  params: { member: memberSlug }
})

export const getTeamMemberPath = (memberSlug: string, locale: Locale): string =>
  getPathname({ locale, href: getTeamMemberHref(memberSlug) })

export const getTeamMemberUrl = (memberSlug: string, locale: Locale): string =>
  `${baseUrl}${getTeamMemberPath(memberSlug, locale)}`
