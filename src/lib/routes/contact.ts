import { baseUrl } from '@/lib/site'

export const getTeamMemberHref = (memberSlug: string) => `/contact/${memberSlug}`

export const getTeamMemberPath = (memberSlug: string) => `/contact/${memberSlug}`

export const getTeamMemberUrl = (memberSlug: string) => `${baseUrl}${getTeamMemberPath(memberSlug)}`
