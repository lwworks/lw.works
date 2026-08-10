import { TeamMemberPage } from '@/components/pages/team-member'
import { getTeamMemberUrl } from '@/lib/routes/contact'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const teamMembers = ['lukas'] as const

export function generateStaticParams() {
  return teamMembers.map((member) => ({ member }))
}

export async function generateMetadata({ params }: PageProps<'/contact/[member]'>): Promise<Metadata> {
  const { member } = await params
  if (!teamMembers.includes(member as typeof teamMembers[number])) notFound()

  return {
    title: 'Termin buchen mit Lukas Brunkhorst — LW Works GmbH',
    description: 'Buche einen unverbindlichen Beratungstermin mit Lukas Brunkhorst, Geschäftsführer & Design Engineer bei LW Works.',
    alternates: {
      canonical: getTeamMemberUrl(member),
    },
    openGraph: {
      title: 'Termin buchen mit Lukas Brunkhorst — LW Works GmbH',
      description: 'Buche einen unverbindlichen Beratungstermin mit Lukas Brunkhorst, Geschäftsführer & Design Engineer bei LW Works.',
      url: getTeamMemberUrl(member),
      locale: 'de_DE',
    },
  }
}

export default async function TeamMemberBookingPage({ params }: PageProps<'/contact/[member]'>) {
  const { member } = await params
  if (!teamMembers.includes(member as typeof teamMembers[number])) notFound()

  return <TeamMemberPage />
}
