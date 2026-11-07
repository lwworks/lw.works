import { createContactAction } from "@/app/kontakte/actions"
import { ContactForm } from "@/components/contacts/contact-form"
import type { CompanyListItem } from "@/lib/db/companies/list-companies"
import type { TagListItem } from "@/lib/db/tags/list-tags"
import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"
import { ArrowLeft } from "@mynaui/icons-react"
import Link from "next/link"
import { Layout } from "../molecules/layout"

export const NewContactPage = ({
  companies,
  tags,
}: {
  companies: CompanyListItem[]
  tags: TagListItem[]
}) => {
  return (
    <Layout>
      <section>
        <div className={cn("border-b border-neutral-200 px-16 pt-9 pb-8 dark:border-neutral-800")}>
          <Link href="/kontakte" className={cn("mb-4 flex w-fit items-center gap-1 text-sm hover:text-black dark:hover:text-white")}>
            <ArrowLeft strokeWidth={1.5} className="size-4" />
            <span>Kontakte</span>
          </Link>
          <Heading as="h1" size="h3">Neuer Kontakt</Heading>
        </div>
        <div className={cn("max-w-lg px-16 py-8")}>
          <ContactForm companies={companies} tags={tags} action={createContactAction} layout="page" />
        </div>
      </section>
    </Layout>
  )
}
