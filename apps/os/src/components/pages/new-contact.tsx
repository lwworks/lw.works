import { CompanySelect, TagChoices } from "@/components/contacts/contact-option-fields"
import { NewContactForm } from "@/components/contacts/new-contact-form"
import { Heading } from "@lw/ui/atoms/heading"
import { Skeleton } from "@lw/ui/components/skeleton"
import { cn } from "@lw/ui/lib/utils"
import { ArrowLeft } from "@mynaui/icons-react"
import Link from "next/link"
import { Suspense } from "react"
import { Layout } from "../molecules/layout"

export const NewContactPage = () => {
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
          <NewContactForm
            companyField={
              <Suspense fallback={<Skeleton className={cn("h-8 w-full rounded-lg")} />}>
                <CompanySelect />
              </Suspense>
            }
            tagsField={
              <Suspense fallback={<Skeleton className={cn("h-8 w-full rounded-lg")} />}>
                <TagChoices />
              </Suspense>
            }
          />
        </div>
      </section>
    </Layout>
  )
}
