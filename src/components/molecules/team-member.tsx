import { Brow } from "@/components/atoms/brow";
import { Heading } from "@/components/atoms/heading";
import { team, TeamMemberSlug } from "@/content/team";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface TeamMemberProps {
  member: TeamMemberSlug;
  showBrow?: boolean;
  brow?: string;
  showDescription?: boolean;
  description?: string;
  className?: string;
  headingLevel?: "h1" | "h2" | "h3";
  headingSize?: "h1" | "h2" | "h3";
}

export const TeamMember = ({ member, showBrow = true, brow, showDescription = false, description, className, headingLevel = "h3", headingSize = "h2" }: TeamMemberProps) => {
  const teamMember = team[member];
  if (!teamMember) return null;

  return (
    <>
      <div className={cn("flex items-center gap-4", className)}>
        <div className="relative rounded-full overflow-hidden size-18 sm:size-24 shrink-0 border-2">
          <Image src="/images/team/lukas-brunkhorst.jpg" alt="Lukas Brunkhorst" fill className="object-cover object-center" />
        </div>
        <div>
          {showBrow && <Brow color="none">{brow ?? 'Dein Ansprechpartner'}</Brow>}
          <Heading as={headingLevel} size={headingSize} className="-ml-0.5 text-2xl">{teamMember.name}</Heading>
          <p className="text-sm sm:text-base">{teamMember.title}</p>
        </div>
      </div>
      {showDescription && <p className="mt-8">{description ?? teamMember.description}</p>}
    </>
  )
}