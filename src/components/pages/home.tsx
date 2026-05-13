import { DigitalDealerPromoSection, DigitalDealerPromoSectionContent } from "@/components/sections/home/digital-dealer-promo"
import { Metadata } from "next"
import { HomeHeroSection } from "../sections/home/hero"

export type HomePageContent = {
  metadata: Metadata
  digitalDealerPromo: DigitalDealerPromoSectionContent
}

export const HomePage = ({ content }: { content: HomePageContent }) => {
  return (
    <main className="pt-16">
      <HomeHeroSection />
      <DigitalDealerPromoSection content={content.digitalDealerPromo} />
    </main>
  )
}