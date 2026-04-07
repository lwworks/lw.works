import type { TeamMemberPageContent } from '@/components/pages/team-member'
import type { Locale } from '@/i18n/locale'

export const teamMemberSlugs = {
  lukas: 'lukas'
} as const

export type TeamMemberSlug = keyof typeof teamMemberSlugs

const loaders: Record<TeamMemberSlug, Record<Locale, () => Promise<TeamMemberPageContent>>> = {
  lukas: {
    de: () => import('./lukas/de').then((m) => m.default),
    en: () => import('./lukas/en').then((m) => m.default)
  }
}

export function getAllTeamMemberSlugs(): string[] {
  return Object.values(teamMemberSlugs)
}

export function getTeamMemberKey(slug: string): TeamMemberSlug | null {
  for (const [key, s] of Object.entries(teamMemberSlugs)) {
    if (s === slug) return key as TeamMemberSlug
  }
  return null
}

export function loadTeamMemberContent(slug: string, locale: Locale): Promise<TeamMemberPageContent> | null {
  const key = getTeamMemberKey(slug)
  if (!key) return null
  return loaders[key][locale]()
}
