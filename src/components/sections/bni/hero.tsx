import { Brow } from "@/components/atoms/brow"
import { Heading } from "@/components/atoms/heading"
import { NextAvailability } from "@/components/atoms/next-availability"
import { Section } from "@/components/sections"
import Image from "next/image"

export const BniHeroSection = () => {
  return (
    <Section background="paint-1">
      <Brow color="lavender" className="mb-2">Für BNI-Mitglieder</Brow>
      <Heading as="h1" className="text-3xl sm:text-4xl lg:text-5xl">
        <Image src="/images/logos/bni-black.svg" alt="BNI Logo" width={167} height={64} className="inline-block dark:hidden h-8 w-auto ml-1 mr-3 -mt-2" />
        <Image src="/images/logos/bni-white.svg" alt="BNI Logo" width={167} height={64} className="hidden dark:inline-block h-8 w-auto ml-1 mr-3 -mt-2" />
        <span>Vier-Augen-Gespräch<br />mit Lukas Brunkhorst</span>
      </Heading>
      <p className="mt-8 max-w-md text-balance"><span className="font-medium text-black dark:text-white">Lass uns netzwerken!</span> Als BNI-Mitglied kannst Du Dir ganz einfach ein Vier-Augen-Gespräch einbuchen.</p>
      <div className="mt-4 h-5.5">
        <NextAvailability bookingType="bni" />
      </div>
    </Section >
  )
}