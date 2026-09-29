import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "@mynaui/icons-react"
import Image from "next/image"
import Link from "next/link"
import { Section } from ".."

export const ReviewSitesSection = () => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 dark:divide-white/10">
        <div className="p-4 py-8 sm:px-8 lg:p-8 lg:pl-16 lg:py-16">
          <Image src="/images/logos/google-black.svg" alt="Google Logo" width={238} height={72} className="h-7 -mt-1 w-auto dark:hidden" />
          <p className="my-4">Schreibe uns eine Bewertung bei Google.</p>
          <Button asChild>
            <Link href="https://g.page/r/CV75kzevVscWEBM/review" target="_blank" rel="noopener noreferrer">
              <span>Bei Google bewerten</span>
              <ArrowUpRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-8 lg:py-16">
          <Image src="/images/logos/trustpilot-black.svg" alt="Trustpilot Logo" width={326} height={80} className="h-8 -mt-2 w-auto dark:hidden" />
          <p className="my-4">Bewerte unsere Arbeit auf Trustpilot.</p>
          <Button asChild>
            <Link href="https://de.trustpilot.com/review/lw.works" target="_blank" rel="noopener noreferrer">
              <span>Auf Trustpilot bewerten</span>
              <ArrowUpRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
        </div>
        <div className="p-4 py-8 sm:px-8 lg:p-8 lg:pr-16 lg:py-16">
          <Image src="/images/logos/proven-expert-black.svg" alt="ProvenExpert Logo" width={467} height={64} className="h-6 w-auto dark:hidden" />
          <p className="my-4">Bewerte uns bei ProvenExpert.</p>
          <Button asChild>
            <Link href="https://www.provenexpert.com/de-de/lw-works-gmbh/0sae/" target="_blank" rel="noopener noreferrer">
              <span>Bei ProvenExpert bewerten</span>
              <ArrowUpRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>
    </Section>
  )
}