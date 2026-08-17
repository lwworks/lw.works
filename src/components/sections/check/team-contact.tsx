import { TeamMember } from "@/components/molecules/team-member"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Section, verticalPaddings } from ".."

export const CheckTeamContactSection = () => {
  return (
    <Section id="team-contact" verticalPadding="none" background="paint-4">
      <div className="grid grid-cols-4">
        <div className={cn("col-span-3 border-r border-black/10 dark:border-white/10 pr-16", verticalPaddings.small)}>
          <TeamMember member="lukas" showDescription />
        </div>
        <div className="relative">
          <div className="dark:hidden absolute inset-0 p-16 pr-0 flex flex-col items-center justify-between">
            <Image src="/images/logos/airbus-black.svg" alt="Airbus Logo" width={346} height={64} className="flex-0 h-4 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/brunkhorst-black.svg" alt="Brunkhorst Logo" width={318} height={96} className="flex-0 h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/amazon-black.svg" alt="Amazon Logo" width={318} height={96} className="flex-0 h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/bmw-black.svg" alt="BMW Logo" width={128} height={128} className="flex-0 size-12 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/lehmann-black.svg" alt="Lehmann Logo" width={318} height={96} className="flex-0 h-8 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </div>
          <div className="hidden dark:flex absolute inset-0 p-16 pr-0 flex-col items-center justify-between">
            <Image src="/images/logos/airbus-white.svg" alt="Airbus Logo" width={346} height={64} className="flex-0 h-4 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/brunkhorst-white.svg" alt="Brunkhorst Logo" width={318} height={96} className="flex-0 h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/amazon-white.svg" alt="Amazon Logo" width={318} height={96} className="flex-0 h-6 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/bmw-white.svg" alt="BMW Logo" width={128} height={128} className="flex-0 size-12 w-auto opacity-50 hover:opacity-100 transition-opacity" />
            <Image src="/images/logos/lehmann-white.svg" alt="Lehmann Logo" width={318} height={96} className="flex-0 h-8 w-auto opacity-50 hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </Section>

  )
}