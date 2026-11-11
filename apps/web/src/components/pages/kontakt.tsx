import { Main } from "@lw/ui/atoms/main"
import { TeamMember } from "@/components/molecules/team-member"
import { Section } from "@/components/sections"
import { BookingSection } from "@/components/sections/booking"
import { ContactChannelsSection } from "@/components/sections/contact/channels"
import { ContactHeroSection } from "@/components/sections/contact/hero"
import { ContactLocationSection } from "@/components/sections/contact/location"
import { lukas } from "@/content/team/lukas"

export const KontaktPage = () => {
  return (
    <Main>
      <ContactHeroSection />
      <ContactChannelsSection />
      <Section background="stripes" verticalPadding="small">
        <TeamMember member="lukas" showDescription />
      </Section>
      <BookingSection
        heading="Termin buchen"
        description="Lass uns quatschen! Hier kannst Du Dir ein Online-Meeting mit mir einbuchen."
        bookingConfig={lukas.bookingOptions.lukas}
        showMessageInput={true}
      />
      <ContactLocationSection />
    </Main>
  )
}
