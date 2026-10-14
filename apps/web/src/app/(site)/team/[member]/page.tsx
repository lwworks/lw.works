import { ContactPage } from '@/components/pages/contact'
import { isTeamMemberSlug, team } from '@/content/team'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ member: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(team).map((member) => ({ member: member.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { member } = await params
  if (!isTeamMemberSlug(member)) return {}

  const { name, title } = team[member]
  return {
    title: `Kontakt: ${name}`,
    description: `Nimm Kontakt mit ${name} (${title}) von der LW Works GmbH auf.`,
    alternates: {
      canonical: `/team/${member}`,
    },
  }
}

export default async function Page({ params }: Props) {
  const { member } = await params
  if (!isTeamMemberSlug(member)) notFound()

  return <ContactPage member={member} />
}
