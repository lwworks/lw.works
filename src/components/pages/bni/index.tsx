import { Main } from "@/components/main"
import { BniAboutSection } from "@/components/sections/bni/about"
import { BniHeroSection } from "@/components/sections/bni/hero"
import { BookingSection } from "@/components/sections/booking"
import { lukas } from "@/content/team/lukas"

export const BniPage = () => {
  return (
    <Main>
      <BniHeroSection />
      <BniAboutSection />
      <BookingSection
        heading="Termin vereinbaren"
        description="Such Dir einen Termin für unser Vier-Augen-Gespräch aus — ich freue mich!"
        bookingConfig={lukas.bookingOptions.bni}
      />
    </Main>
  )
}