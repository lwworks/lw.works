import { CompanyIcon } from "@/components/atoms/company-icon"
import { ArchiveProjectButton } from "@/components/projects/archive-project-button"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { ProjectBadge } from "@/components/projects/project-badge"
import { TabLink, TabNav } from "@/components/molecules/tabs"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import { formatDuration } from "@/lib/format/format-duration"
import { formatBilling } from "@/lib/projects/format-billing"
import { formatProjectPeriod } from "@/lib/projects/format-project-period"
import { projectStatusLabel } from "@/lib/projects/project-status-label"
import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"
import { Archive, ArrowLeft } from "@mynaui/icons-react"
import Link from "next/link"
import type { ReactNode } from "react"

export type ProjectTab = "context" | "time"

const TABS: { tab: ProjectTab; label: string; path: string }[] = [
  { tab: "context", label: "Kontext", path: "" },
  { tab: "time", label: "Zeiterfassung", path: "/zeiterfassung" },
]

/** Header and base data of a project, then the tabs; the active tab's content comes in as `children`. */
export const ProjectDetails = ({
  project,
  contactOptions,
  tab,
  children,
}: {
  project: ProjectDetail
  contactOptions: ProjectContactOption[]
  tab: ProjectTab
  children: ReactNode
}) => {
  const archived = project.archivedAt !== null
  const period = formatProjectPeriod(project)
  return (
    <section>
      <div className={cn("border-b border-neutral-200 px-4 sm:px-8 lg:px-16 pt-9 pb-8 dark:border-neutral-800")}>
        <Link href={archived ? "/projekte?archiviert=1" : "/projekte"} className={cn("mb-4 flex w-fit items-center gap-1 text-sm hover:text-black dark:hover:text-white")}>
          <ArrowLeft strokeWidth={1.5} className={cn("size-4")} />
          <span>Projekte</span>
        </Link>
        <div className={cn("flex flex-wrap items-center justify-between gap-4")}>
          <div className={cn("flex min-w-0 items-center gap-3")}>
            <ProjectBadge projectKey={project.key} companyId={project.companyId} logoKey={project.company.logoKey} className={cn("h-6 px-2.5 text-sm")} />
            <Heading as="h1" size="h2" className={cn("truncate")}>{project.title}</Heading>
          </div>
          <div className={cn("flex shrink-0 items-center gap-2")}>
            {archived ? null : (
              <EditProjectDialog
                id={project.id}
                slug={project.slug}
                companyName={project.company.name}
                contactOptions={contactOptions}
                project={{
                  key: project.key,
                  title: project.title,
                  status: project.status,
                  startDate: project.startDate,
                  endDate: project.endDate,
                  companyId: project.companyId,
                  billing: project.billing,
                  hourlyRateCents: project.hourlyRateCents,
                  fixedPriceCents: project.fixedPriceCents,
                  retainerAmountCents: project.retainerAmountCents,
                  retainerHours: project.retainerHours,
                  contactIds: project.contacts.map((contact) => contact.id),
                }}
              />
            )}
            <ArchiveProjectButton id={project.id} projectKey={project.key} archived={archived} />
          </div>
        </div>
        {archived ? (
          <p className={cn("mt-4 flex items-center gap-2 text-sm")}>
            <Archive strokeWidth={1.5} className={cn("size-4")} />
            Archiviert. Das Kürzel ist wieder frei; das Projekt kann nicht bearbeitet werden.
          </p>
        ) : null}
      </div>

      <dl className={cn("grid grid-cols-1 gap-x-8 gap-y-6 px-4 sm:px-8 lg:px-16 py-8 text-sm sm:grid-cols-3")}>
        <Item label="Kunde">
          <Link href={`/unternehmen/${project.company.id}`} className={cn("inline-flex items-center gap-1.5 hover:underline")}>
            <CompanyIcon companyId={project.company.id} logoKey={project.company.logoKey} />
            <span>{project.company.name}</span>
          </Link>
        </Item>
        <Item label="Status">{projectStatusLabel(project.status)}</Item>
        <Item label="Zeitraum">{period ?? "Offen"}</Item>
        <Item label="Ansprechpartner">
          {project.contacts.length === 0 ? (
            <span className={cn("font-normal")}>Keine sichtbaren Ansprechpartner.</span>
          ) : (
            <ul className={cn("flex flex-col gap-1")}>
              {project.contacts.map((contact) => (
                <li key={contact.id}>
                  <Link href={`/kontakte/${contact.displayId}`} className={cn("hover:underline")}>
                    {formatContactName(contact.firstName, contact.lastName)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Item>
        <Item label="Abrechnung">{formatBilling(project)}</Item>
        <Item label="Erfasst (alle)">
          <span className={cn("tabular-nums")}>{formatDuration(project.trackedMs)}</span>
          <span className={cn("block font-normal tabular-nums")}>
            {formatDuration(project.openMs)} offen · {formatDuration(project.billedMs)} abgerechnet
          </span>
        </Item>
      </dl>

      <div className={cn("px-4 sm:px-8 lg:px-16")}>
        <TabNav aria-label="Projektansicht">
          {TABS.map((item) => (
            <TabLink key={item.tab} href={`/projekte/${project.slug}${item.path}`} active={tab === item.tab}>
              {item.label}
            </TabLink>
          ))}
        </TabNav>
      </div>
      <div className={cn("border-t border-neutral-200 dark:border-neutral-800")}>{children}</div>
    </section>
  )
}

const Item = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <dt>{label}</dt>
    <dd className={cn("mt-1 font-medium text-black dark:text-white")}>{children}</dd>
  </div>
)
