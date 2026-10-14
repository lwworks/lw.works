import { ContactConfirmationPage } from '@/components/pages/contact-confirmation'
import { isTeamMemberSlug, team } from '@/content/team'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type Props = {
  params: Promise<{ member: string }>
}

export const dynamicParams = false

export const metadata: Metadata = {
  title: 'Termin bestätigt',
  description: '',
}

export function generateStaticParams() {
  return Object.values(team).map((member) => ({ member: member.slug }))
}

export default async function Page({ params }: Props) {
  const { member } = await params
  if (!isTeamMemberSlug(member)) notFound()

  return (
    <Suspense>
      <ContactConfirmationPage member={member} />
    </Suspense>
  )
}
