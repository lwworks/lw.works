import { Brow } from "@/components/atoms/brow"
import { Mobile } from "@mynaui/icons-react"
import { Section } from ".."

export type ContactOptionsSectionContent = {
  id: string
  title: string
  description: string
  options: {
    label: string
    href: string
  }[]
}

export const ContactOptionsSection = ({ content }: { content?: ContactOptionsSectionContent }) => {
  return (
    <Section verticalPadding="none" horizontalPadding="none">
      <div className="grid grid-cols-3 divide-x divide-black/10 dark:divide-white/10">
        <div className="flex items-center gap-2 py-8 px-16">
          <Mobile className="size-6 shrink-0 text-indigo-500" />
          <div>
            <Brow variant="small">Telefon</Brow>
            <div className="text-black dark:text-white font-semibold">+49 4765 829 3999</div>
          </div>
        </div>
        <div></div>

      </div>
    </Section>
  )
}