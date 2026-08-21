import { TeamMember } from "@/components/molecules/team-member"
import { Section } from "@/components/sections"

export const BniAboutSection = () => {
  return (
    <Section verticalPadding="small">
      <TeamMember
        member="lukas"
        brow="LW Works GmbH"
        showDescription
        description="Wir digitalisieren den Mittelstand — frag mich aus zu Prozessautomatisierung, Software und KI. Mit diesen Themen helfen wir Unternehmen, Wachstum zu ermöglichen und ihre Marge zu maximieren."
      />
    </Section>
  )
}