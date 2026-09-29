import { Main } from "../main"
import { ReviewGuideSection } from "../sections/review/guide"
import { ReviewHeroSection } from "../sections/review/hero"
import { ReviewSitesSection } from "../sections/review/sites"

export const ReviewPage = () => {
  return (
    <Main>
      <ReviewHeroSection />
      <ReviewSitesSection />
      <ReviewGuideSection />
    </Main>
  )
}