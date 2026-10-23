import { InstagramIcon } from "@lw/ui/atoms/custom-icons/instagram"
import { LinkedInIcon } from "@lw/ui/atoms/custom-icons/linkedin"
import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { XIcon } from "@lw/ui/atoms/custom-icons/x"
import { Heading } from "@lw/ui/atoms/heading"
import { Avatar } from "@lw/ui/components/avatar"
import { Button } from "@lw/ui/components/button"
import { ArrowLeft, At, Gift, Pencil, Telephone, UserSquare } from "@mynaui/icons-react"
import Image from "next/image"
import Link from "next/link"

export const ContactDetails = () => {
  return (
    <section>
      <div className="px-16 pb-8 pt-9 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center text-sm gap-2 mb-4">
          <Link href="/kontakte" className="flex items-center gap-1 hover:text-black dark:hover:text-white">
            <ArrowLeft strokeWidth={1.5} className="size-4" />
            <span>Kontakte</span>
          </Link>
          <span>{'//'}</span>
          <span className="font-mono">#0002</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="size-15 border">
            <Image src="https://bni-bremen.de/web/open/appsCmsImageDownload?imageObjectId=6a16bab78e03e60001bd8811" alt="Jörn Lehmann" fill className="object-cover object-center" />
          </Avatar>
          <div>
            <div className="flex items-center justify-between">
              <Heading as="h1" size="h2">Christoph Nienaber</Heading>
            </div>
            <Link href="/unternehmen/1" className="inline-flex items-center h-6 gap-1.5 pl-1.5 pr-2 border rounded-full hover:bg-neutral-100 hover:text-black dark:hover:text-white text-sm">
              <Image src="https://res2.weblium.site/res/69e8982280915637dee8804d/6a86f9885b2845794e0701b9_optimized" alt="LMB GmbH & Co. KG" width={32} height={32} className="size-3.5" />
              <span className="truncate">Drehimpuls</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-b border-neutral-200 dark:border-neutral-800 grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-800">
        <div className="p-8 pl-16">
          <div className="flex items-center justify-between">
            <Heading as="h2" size="h4">Details</Heading>
            <Button variant="ghost" size="sm">
              <Pencil strokeWidth={1.5} className="size-4" />
              <span>Bearbeiten</span>
            </Button>
          </div>
          <table className="text-sm w-full mt-4">
            <tbody>
              <tr className="h-8">
                <td className="pr-4">
                  <UserSquare strokeWidth={1.5} className="size-4 inline mr-1 mb-0.5" />
                  <span>Vorname</span>
                </td>
                <td className="font-medium text-black dark:text-white">Christoph</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <UserSquare strokeWidth={1.5} className="size-4 inline mr-1 mb-0.5" />
                  <span>Nachname</span>
                </td>
                <td className="font-medium text-black dark:text-white">Nienaber</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <Gift className="size-4 inline mr-1 mb-0.5" />
                  <span>Geburtstag</span>
                </td>
                <td className="font-medium text-black dark:text-white">17.03.1996</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <At strokeWidth={1.5} className="size-4 inline mr-1 mb-0.5" />
                  <span>E-Mail</span>
                </td>
                <td className="font-medium text-black dark:text-white">christoph@nienaber.de</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <Telephone strokeWidth={1.5} className="size-4 inline mr-1 mb-0.5" />
                  <span>Telefon</span>
                </td>
                <td className="font-medium text-black dark:text-white">+49 123 456 789</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <WhatsAppIcon className="size-4 inline mr-1 mb-0.5" />
                  <span>WhatsApp</span>
                </td>
                <td className="font-medium text-black dark:text-white">+49 123 456 789</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <LinkedInIcon className="size-4 inline mr-1 mb-0.5" />
                  <span>LinkedIn</span>
                </td>
                <td className="font-medium text-black dark:text-white">Christoph Nienaber</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <InstagramIcon className="size-4 inline mr-1 mb-0.5" />
                  <span>Instagram</span>
                </td>
                <td className="font-medium text-black dark:text-white">@christophnienaber</td>
              </tr>
              <tr className="h-8">
                <td className="pr-4">
                  <XIcon className="size-4 inline mr-1 mb-0.5" />
                  <span>Twitter</span>
                </td>
                <td className="font-medium text-black dark:text-white">@christophnienaber</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="p-8 pr-16">
        </div>
      </div>
    </section>
  )
}