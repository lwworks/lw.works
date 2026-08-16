import { Brow } from "@/components/atoms/brow";
import { Heading } from "@/components/atoms/heading";
import { Section } from "@/components/sections";

export default function NotFound() {
  return (
    <main className="pt-16">
      <Section verticalPadding="none" horizontalPadding="none">
        <div className="h-[calc(100vh-4rem)] grid grid-cols-2 divide-x divide-black/10 dark:divide-white/10">
          <div className="p-16 py-28 flex flex-col items-center bg-neutral-50 dark:bg-[#0F0F0F] border-l border-b border-black/10 dark:border-white/10">
            <Heading as="h1" className="text-[16rem] vertical text-lavender dark:text-lavender">404</Heading>
          </div>
          <div className="p-16 py-24">
            <Brow color="lavender" className="mb-2">Fehler 404</Brow>
            <Heading as="h2">Seite nicht gefunden.</Heading>
          </div>
        </div>
      </Section>
    </main>
  )
}