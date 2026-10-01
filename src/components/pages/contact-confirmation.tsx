'use client'

import { Main } from "@/components/main"
import { BookingConfirmationSection } from "@/components/sections/booking/confirmation"
import { TeamMemberSlug } from "@/content/team"

export const ContactConfirmationPage = ({ member }: { member: TeamMemberSlug }) => {
  return (
    <Main>
      <BookingConfirmationSection fallback={`/team/${member}`} />
    </Main>
  )
}
