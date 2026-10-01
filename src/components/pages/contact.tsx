import { team, TeamMemberSlug } from "@/content/team"
import { Main } from "../main"
import { BookingSection } from "../sections/booking"
import { MemberContactSection } from "../sections/contact/member-contact"
import { MemberHeroSection } from "../sections/contact/member-hero"

export const ContactPage = ({ member }: { member: TeamMemberSlug }) => {
  return (
    <Main>
      <MemberHeroSection member={member} />
      <MemberContactSection member={member} />
      <BookingSection heading="Termin buchen" description="Lass uns quatschen! Hier kannst Du uns ein Online-Meeting einbuchen." bookingConfig={team[member].bookingOptions.lukas} showMessageInput={true} />
    </Main>
  )
}
