import { createProjectAction } from "@/app/projekte/actions"
import { ProjectForm } from "@/components/projects/project-form"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"
import { ArrowLeft } from "@mynaui/icons-react"
import Link from "next/link"
import { Layout } from "../molecules/layout"

export const NewProjectPage = ({
  companies,
  contactOptions,
}: {
  companies: { id: string; name: string }[]
  contactOptions: ProjectContactOption[]
}) => {
  return (
    <Layout>
      <section>
        <div className={cn("border-b border-neutral-200 px-16 pt-9 pb-8 dark:border-neutral-800")}>
          <Link href="/projekte" className={cn("mb-4 flex w-fit items-center gap-1 text-sm hover:text-black dark:hover:text-white")}>
            <ArrowLeft strokeWidth={1.5} className={cn("size-4")} />
            <span>Projekte</span>
          </Link>
          <Heading as="h1" size="h3">Neues Projekt</Heading>
        </div>
        <div className={cn("max-w-xl px-16 py-8")}>
          <ProjectForm companies={companies} contactOptions={contactOptions} action={createProjectAction} />
        </div>
      </section>
    </Layout>
  )
}
