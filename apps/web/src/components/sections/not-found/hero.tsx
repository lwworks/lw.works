import { Brow } from "@lw/ui/atoms/brow"
import { Heading } from "@lw/ui/atoms/heading"
import { Section } from "@/components/sections"

export const NotFoundHeroSection = () => {
  return (
    <Section background="paint-4">
      <Heading as="h1" className="text-[6rem] sm:text-[10rem] lg:text-[16rem] leading-none -ml-1 sm:-ml-2 lg:-ml-3">404</Heading>
      <Brow color="lavender" className="mb-2 mt-8">Fehler 404</Brow>
      <Heading as="h2">Seite nicht gefunden.</Heading>
      <p className="mt-4 max-w-lg text-balance">Für die URL, die Du eingegeben hast, existiert hier leider keine Seite.</p>
    </Section >
  )
}