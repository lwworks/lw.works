import type { Metadata } from 'next'
import { CalendarBookingSection, CalendarBookingSectionContent } from '../sections/contact/calendar-booking'
import { ContactOptionsSection } from '../sections/contact/contact-options'
import { TeamMemberSection, TeamMemberSectionContent } from '../sections/contact/team-member'

export type TeamMemberPageContent = {
  metadata: Metadata
  member: TeamMemberSectionContent
  calendar: CalendarBookingSectionContent
}

export const TeamMemberPage = ({ content }: { content: TeamMemberPageContent }) => {
  return (
    <main className="pt-16">
      <TeamMemberSection content={content.member} />
      <ContactOptionsSection />
      <CalendarBookingSection content={content.calendar} />
    </main>
  )
}
