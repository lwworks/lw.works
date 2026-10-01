import { TeamMember } from "@/components/molecules/team-member"
import { TeamMemberSlug } from "@/content/team"
import { Section } from ".."

export const MemberHeroSection = ({ member }: { member: TeamMemberSlug }) => {
  return (
    <Section background="paint-5">
      <TeamMember member={member} showDescription showBrow={false} headingLevel="h1" headingSize="h1" />
    </Section>
  )
}