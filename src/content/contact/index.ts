import type { TeamMemberPageContent } from '@/components/pages/team-member'
import type { Locale } from '@/i18n/locale'

export const teamMemberSlugs = {
  lukas: {
    de: 'lukas',
    en: 'lukas'
  }
} as const

export type TeamMemberKey = keyof typeof teamMemberSlugs
export type TeamMemberSlug = TeamMemberKey

const loaders: Record<TeamMemberKey, Record<Locale, () => Promise<TeamMemberPageContent>>> = {
  lukas: {
    de: () => import('./lukas/de').then((m) => m.default),
    en: () => import('./lukas/en').then((m) => m.default)
  }
}

export function getAllTeamMemberSlugs(locale?: Locale): string[] {
  if (locale) {
    return Object.values(teamMemberSlugs).map((slugs) => slugs[locale])
  }
  return [...new Set(Object.values(teamMemberSlugs).flatMap((slugs) => Object.values(slugs)))]
}

export function getTeamMemberSlug(memberKey: TeamMemberKey, locale: Locale): string {
  return teamMemberSlugs[memberKey][locale]
}

export function getTeamMemberKeyBySlug(slug: string, locale: Locale): TeamMemberKey | null {
  for (const [key, localizedSlugs] of Object.entries(teamMemberSlugs)) {
    if (localizedSlugs[locale] === slug) return key as TeamMemberKey
  }
  return null
}

export function getTeamMemberKey(slug: string): TeamMemberKey | null {
  const locales = Object.keys(Object.values(teamMemberSlugs)[0]) as Locale[]
  for (const locale of locales) {
    const key = getTeamMemberKeyBySlug(slug, locale)
    if (key) return key
  }
  return null
}

export function loadTeamMemberContent(slug: string, locale: Locale): Promise<TeamMemberPageContent> | null {
  const key = getTeamMemberKeyBySlug(slug, locale)
  if (!key) return null
  return loaders[key][locale]()
}
