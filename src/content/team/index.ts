import { lukas } from './lukas'

export const team = { lukas }

export type TeamMemberSlug = keyof typeof team

export const isTeamMemberSlug = (slug: string): slug is TeamMemberSlug => slug in team
