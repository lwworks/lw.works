import { Brow } from "@/components/atoms/brow";
import { Heading } from "@/components/atoms/heading";
import { lukas } from "@/content/team/lukas";
import Image from "next/image";

const members = { lukas }
export type TeamMember = keyof typeof members

interface TeamMemberProps {
  member: TeamMember;
  brow?: string;
  showDescription?: boolean;
  description?: string;
}

export const TeamMember = ({ member, brow, showDescription = false, description }: TeamMemberProps) => {
  const teamMember = members[member];
  if (!teamMember) return null;

  return (
    <>
      <div className="flex items-center gap-4">
        <div className="relative rounded-full overflow-hidden size-18 sm:size-24 shrink-0 border-2">
          <Image src="/images/team/lukas-brunkhorst.jpg" alt="Lukas Brunkhorst" fill className="object-cover object-center" />
        </div>
        <div>
          <Brow color="none">{brow ?? 'Dein Ansprechpartner'}</Brow>
          <Heading as="h3" size="h2" className="-ml-0.5">{teamMember.name}</Heading>
          <p className="text-sm sm:text-base">{teamMember.title}</p>
        </div>
      </div>
      {showDescription && <p className="mt-8">{description ?? teamMember.description}</p>}
    </>
  )
}