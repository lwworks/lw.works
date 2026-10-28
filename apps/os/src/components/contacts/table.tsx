import { WhatsAppIcon } from "@lw/ui/atoms/custom-icons/whatsapp"
import { Avatar } from "@lw/ui/components/avatar"
import { Button } from "@lw/ui/components/button"
import { Skeleton } from "@lw/ui/components/skeleton"
import { Mail, Plus, Telephone } from "@mynaui/icons-react"
import Image from "next/image"
import Link from "next/link"
import { PageHeader } from "../molecules/page-header"

const title = "Kontakte"
const description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos."

export const ContactsTable = () => {
  return (
    <section>
      <PageHeader title={title} description={description}>
        <Button>
          <Plus strokeWidth={1.5} className="size-4" />
          <span>Neuer Kontakt</span>
        </Button>
      </PageHeader>
      <table className="text-sm w-full">
        <thead>
          <tr className="h-10 border-y border-neutral-200 dark:border-neutral-800">
            <td className="pl-16 pr-2">
              <div className="size-4 rounded-[5px] border border-neutral-300" />
            </td>
            <td className="pr-2">ID</td>
            <td className="pr-2">Name</td>
            <td className="pr-2">Unternehmen</td>
            <td className="pr-2">Tags</td>
            <td className="pr-16 text-right">Aktionen</td>
          </tr>
        </thead>
        <tbody>
          <tr className="h-10 border-b border-neutral-200 dark:border-neutral-800">
            <td className="pl-16 pr-2">
              <div className="size-4 rounded-[5px] border border-neutral-300" />
            </td>
            <td className="pr-2 font-mono text-neutral-400">#0001</td>
            <td className="pr-2">
              <Link href="/kontakte/id" className="flex items-center gap-1.5 font-medium text-black dark:text-white hover:underline">
                <Avatar size="sm">
                  <Image src="https://i0.wp.com/erp-macher.de/wp-content/uploads/2025/11/csm_Portrait_6b43c369f8.webp?fit=900%2C976&ssl=1" alt="Jörn Lehmann" fill className="object-cover object-center" />
                </Avatar>
                <span>Jörn Lehmann</span>
              </Link>
            </td>
            <td className="pr-2">
              <Link href="/unternehmen/1" className="inline-flex items-center h-6 gap-1.5 pl-1.5 pr-2 border rounded-full hover:bg-neutral-100 hover:text-black dark:hover:text-white">
                <Image src="https://www.hebelifte.de/icon.png?1af97279c55ca467" alt="LMB GmbH & Co. KG" width={32} height={32} className="size-3.5" />
                <span className="truncate">LMB GmbH & Co. KG</span>
              </Link>
            </td>
            <td className="pr-2">
              <div className="inline-flex flex-wrap gap-1">
                <div className="flex items-center border rounded-full h-6 gap-1.5 px-2 hover:bg-neutral-100 hover:text-black dark:hover:text-white cursor-pointer">
                  <span className="size-2 rounded-full bg-neutral-500" />
                  <span>Empfehlung</span>
                </div>
                <div className="flex items-center border rounded-full h-6 gap-1.5 px-2 hover:bg-neutral-100 hover:text-black dark:hover:text-white cursor-pointer">
                  <span className="size-2 rounded-full bg-indigo-500" />
                  <span>Kundengruß</span>
                </div>
              </div>
            </td>
            <td className="pr-16">
              <div className="flex justify-end items-center gap-2">
                <Button variant="outline" size="icon-sm">
                  <Telephone strokeWidth={1.5} className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm">
                  <Mail strokeWidth={1.5} className="size-4" />
                </Button>
              </div>
            </td>
          </tr>
          <tr className="h-10 border-b border-neutral-200 dark:border-neutral-800">
            <td className="pl-16 pr-2">
              <div className="size-4 rounded-[5px] border border-neutral-300" />
            </td>
            <td className="pr-2 font-mono text-neutral-400">#0002</td>
            <td className="pr-2">
              <Link href="/kontakte/id" className="flex items-center gap-1.5 font-medium text-black dark:text-white hover:underline">
                <Avatar size="sm">
                  <Image src="https://bni-bremen.de/web/open/appsCmsImageDownload?imageObjectId=6a16bab78e03e60001bd8811" alt="Jörn Lehmann" fill className="object-cover object-center" />
                </Avatar>
                <span>Christoph Nienaber</span>
              </Link>
            </td>
            <td className="pr-2">
              <Link href="/unternehmen/1" className="inline-flex items-center h-6 gap-1.5 pl-1.5 pr-2 border rounded-full hover:bg-neutral-100 hover:text-black dark:hover:text-white">
                <Image src="https://res2.weblium.site/res/69e8982280915637dee8804d/6a86f9885b2845794e0701b9_optimized" alt="LMB GmbH & Co. KG" width={32} height={32} className="size-3.5" />
                <span className="truncate">Drehimpuls</span>
              </Link>
            </td>
            <td className="pr-2">
              <div className="inline-flex flex-wrap gap-1">
                <div className="flex items-center border rounded-full h-6 gap-1.5 px-2 hover:bg-neutral-100 hover:text-black dark:hover:text-white cursor-pointer">
                  <span className="size-2 rounded-full bg-red-600" />
                  <span>BNI</span>
                </div>
              </div>
            </td>
            <td className="pr-16">
              <div className="flex justify-end items-center gap-2">
                <Button variant="outline" size="icon-sm">
                  <Telephone strokeWidth={1.5} className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm">
                  <WhatsAppIcon className="size-4" />
                </Button>
                <Button variant="outline" size="icon-sm">
                  <Mail strokeWidth={1.5} className="size-4" />
                </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section >
  )
}

export const ContactsTableSkeleton = () => {
  return (
    <section aria-busy="true">
      <PageHeader title={title} description={description}>
        <Skeleton className="h-9 w-36" />
      </PageHeader>
      <table className="text-sm w-full">
        <thead>
          <tr className="h-10 border-y border-neutral-200 dark:border-neutral-800">
            <td className="pl-16 pr-2 w-0"><Skeleton className="size-4" /></td>
            <td className="pr-2">ID</td>
            <td className="pr-2">Name</td>
            <td className="pr-2">Unternehmen</td>
            <td className="pr-2">Tags</td>
            <td className="pr-16 text-right">Aktionen</td>
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((row) => (
            <tr key={row} className="h-10 border-b border-neutral-200 dark:border-neutral-800">
              <td className="pl-16 pr-2"><Skeleton className="size-4" /></td>
              <td className="pr-2"><Skeleton className="h-4 w-12" /></td>
              <td className="pr-2">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </td>
              <td className="pr-2"><Skeleton className="h-6 w-32 rounded-full" /></td>
              <td className="pr-2"><Skeleton className="h-6 w-24 rounded-full" /></td>
              <td className="pr-16">
                <div className="flex justify-end items-center gap-2">
                  <Skeleton className="size-7" />
                  <Skeleton className="size-7" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
