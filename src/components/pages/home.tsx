import { HomeHeroSection } from "../sections/home/hero"
import { PainPointsSection } from "../sections/home/pain-points"
import { ServicesSection } from "../sections/home/services"
import { SolutionSection } from "../sections/home/solution"
import { LogosSection } from "../sections/logos"

export const HomePage = () => {
  return (
    <main className="pt-16">
      <HomeHeroSection />
      <LogosSection logos={["airbus", "amazon", "bmw", "livestore", "brunkhorst", "effect", "lehmann", "porsche", "scoo", "urlbox"]} variant="carousel" />
      <PainPointsSection />
      <SolutionSection />
      <ServicesSection />
    </main>
  )
}
