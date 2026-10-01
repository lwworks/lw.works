import { InstagramIcon } from "@/components/atoms/custom-icons/instagram";
import { LinkedInIcon } from "@/components/atoms/custom-icons/linkedin";
import { WhatsAppIcon } from "@/components/atoms/custom-icons/whatsapp";
import { XIcon } from "@/components/atoms/custom-icons/x";
import { team, TeamMemberSlug } from "@/content/team";
import { Mail, Telephone } from "@mynaui/icons-react";
import Link from "next/link";
import { Section } from "..";

export const MemberContactSection = ({ member }: { member: TeamMemberSlug }) => {
  return (
    <Section verticalPadding="none" background="darker">
      <div className="md:flex md:justify-between py-4">
        <div className="md:flex md:items-center md:gap-8">
          {team[member].contactOptions.email &&
            <Link href={`mailto:${team[member].contactOptions.email}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white">
              <Mail className="size-4" />
              <span>{team[member].contactOptions.email}</span>
            </Link>
          }
          {team[member].contactOptions.phone &&
            <Link href={`tel:${team[member].contactOptions.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white">
              <Telephone className="size-4" />
              <span>{team[member].contactOptions.phone}</span>
            </Link>
          }
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          {team[member].contactOptions.whatsApp &&
            <Link href={team[member].contactOptions.whatsApp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white">
              <WhatsAppIcon className="size-5" />
            </Link>
          }
          {team[member].contactOptions.linkedIn &&
            <Link href={team[member].contactOptions.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white">
              <LinkedInIcon className="size-5" />
            </Link>
          }
          {team[member].contactOptions.x &&
            <Link href={team[member].contactOptions.x} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white">
              <XIcon className="size-5" />
            </Link>
          }
          {team[member].contactOptions.instagram &&
            <Link href={team[member].contactOptions.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 py-2 md:py-4 transition-colors hover:text-black dark:hover:text-white">
              <InstagramIcon className="size-5" />
            </Link>
          }
        </div>
      </div>
    </Section>
  )
}