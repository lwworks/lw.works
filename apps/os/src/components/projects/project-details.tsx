import { RemoteImage } from "@/components/atoms/remote-image"
import { ArchiveProjectButton } from "@/components/projects/archive-project-button"
import { EditProjectDialog } from "@/components/projects/edit-project-dialog"
import { ProjectBadge } from "@/components/projects/project-badge"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import type { ProjectContactOption } from "@/lib/db/contacts/list-project-contact-options"
import type { ProjectDetail } from "@/lib/db/projects/get-project-by-slug"
import type { ProjectTimeEntry } from "@/lib/db/time-entries/list-project-time-entries"
import { formatDate, formatTime } from "@/lib/format/format-date-time"
import { formatDuration } from "@/lib/format/format-duration"
import { formatBilling } from "@/lib/projects/format-billing"
import { formatProjectPeriod } from "@/lib/projects/format-project-period"
import { projectStatusLabel } from "@/lib/projects/project-status-label"
import { stripProjectPrefix } from "@/lib/projects/strip-project-prefix"
import { sumTrackedMs } from "@/lib/time-tracking/sum-tracked-ms"
import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"
import { Archive, ArrowLeft } from "@mynaui/icons-react"
import Link from "next/link"

export const ProjectDetails = ({
  project,
  entries,
  contactOptions,
  now,
}: {
  project: ProjectDetail
  entries: ProjectTimeEntry[]
  contactOptions: ProjectContactOption[]
  now: Date
}) => {
  const archived = project.archivedAt !== null
  const period = formatProjectPeriod(project)
  return (
    <section>
      <div className={cn("border-b border-neutral-200 px-16 pt-9 pb-8 dark:border-neutral-800")}>
        <Link href={archived ? "/projekte?archiviert=1" : "/projekte"} className={cn("mb-4 flex w-fit items-center gap-1 text-sm hover:text-black dark:hover:text-white")}>
          <ArrowLeft strokeWidth={1.5} className={cn("size-4")} />
          <span>Projekte</span>
        </Link>
        <div className={cn("flex items-center justify-between gap-4")}>
          <div className={cn("flex min-w-0 items-center gap-3")}>
            <ProjectBadge projectKey={project.key} className={cn("h-6 px-2.5 text-sm")} />
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
                  description: project.description,
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

      <dl className={cn("grid grid-cols-1 gap-x-8 gap-y-6 border-b border-neutral-200 px-16 py-8 text-sm sm:grid-cols-3 dark:border-neutral-800")}>
        <Item label="Kunde">
          <Link href={`/unternehmen/${project.company.id}`} className={cn("inline-flex items-center gap-1.5 hover:underline")}>
            {project.company.logoUrl ? <RemoteImage src={project.company.logoUrl} alt="" width={14} height={14} className={cn("size-3.5")} /> : null}
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
        </Item>
        {project.description ? (
          <div className={cn("sm:col-span-3")}>
            <dt>Beschreibung</dt>
            <dd className={cn("mt-1 whitespace-pre-line text-black dark:text-white")}>{project.description}</dd>
          </div>
        ) : null}
      </dl>

      <div className={cn("px-16 pt-8 pb-4")}>
        <Heading as="h2" size="h4">Zeiteinträge</Heading>
        <p className={cn("mt-1 text-sm")}>
          Die letzten {entries.length === 50 ? "50 " : ""}Einträge aller Nutzer. Termine mit <span className={cn("font-mono text-black dark:text-white")}>{project.key}:</span> am Anfang des Titels werden automatisch zugeordnet.
        </p>
      </div>
      <table className={cn("w-full text-sm")}>
        <tbody>
          {entries.length === 0 ? (
            <tr className={cn("h-16 border-y border-neutral-200 dark:border-neutral-800")}>
              <td className={cn("px-16")}>Noch keine Zeiteinträge.</td>
            </tr>
          ) : null}
          {entries.map((entry, index) => (
            <tr key={entry.id} className={cn("h-10 border-b border-neutral-200 dark:border-neutral-800", index === 0 && "border-t")}>
              <td className={cn("pr-2 pl-16 tabular-nums whitespace-nowrap")}>
                {formatDate(entry.startAt)} · {formatTime(entry.startAt)}–{formatTime(entry.endAt)}
              </td>
              <td className={cn("w-full max-w-0 truncate pr-2 font-medium text-black dark:text-white")}>
                {stripProjectPrefix(entry.title, project.key)}
              </td>
              <td className={cn("pr-2 whitespace-nowrap")}>{entry.userName}</td>
              <td className={cn("pr-16 text-right tabular-nums whitespace-nowrap")}>
                {entry.endAt > now ? "läuft" : formatDuration(sumTrackedMs([entry], now))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <dt>{label}</dt>
    <dd className={cn("mt-1 font-medium text-black dark:text-white")}>{children}</dd>
  </div>
)
