import { CompanyIcon } from "@/components/atoms/company-icon"
import { DeleteCompanyButton } from "@/components/companies/delete-company-button"
import { EditCompanyDialog } from "@/components/companies/company-form"
import { ProjectBadge } from "@/components/projects/project-badge"
import { formatAddress } from "@/lib/companies/format-address"
import { formatContactName } from "@/lib/contacts/format-contact-name"
import { formatDisplayId } from "@/lib/contacts/format-display-id"
import { projectStatusLabel } from "@/lib/projects/project-status-label"
import type { CompanyDetail } from "@/lib/db/companies/get-company"
import { Heading } from "@lw/ui/atoms/heading"
import { ArrowLeft } from "@mynaui/icons-react"
import Link from "next/link"

export const CompanyDetails = ({ company }: { company: CompanyDetail }) => {
  const locations = company.locations
    .map((location) => ({ ...location, lines: formatAddress(location) }))
    .filter((location) => location.label || location.lines.length > 0)
  return (
    <section>
      <div className="border-b border-neutral-200 px-4 sm:px-8 lg:px-16 pt-9 pb-8 dark:border-neutral-800">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <Link href="/unternehmen" className="flex items-center gap-1 hover:text-black dark:hover:text-white">
            <ArrowLeft strokeWidth={1.5} className="size-4" />
            <span>Unternehmen</span>
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CompanyIcon companyId={company.id} logoKey={company.logoKey} size={40} className="rounded-lg border p-1" />
            <Heading as="h1" size="h2">{company.name}</Heading>
          </div>
          <div className="flex items-center gap-2">
            <EditCompanyDialog
              company={{
                id: company.id,
                logoKey: company.logoKey,
                name: company.name,
                website: company.website,
                locations: company.locations,
              }}
            />
            <DeleteCompanyButton id={company.id} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 border-b border-neutral-200 px-4 sm:px-8 lg:px-16 py-8 md:grid-cols-2 dark:border-neutral-800">
        <div>
          <Heading as="h2" size="h4">{locations.length > 1 ? "Standorte" : "Adresse"}</Heading>
          {locations.length === 0 ? <p className="mt-3 text-sm">Keine Adresse.</p> : (
            <ul className="mt-3 flex flex-col gap-4">
              {locations.map((location) => (
                <li key={location.id} className="text-sm">
                  {location.label ? <span className="mb-0.5 block">{location.label}</span> : null}
                  <p className="font-medium text-black dark:text-white">
                    {location.lines.map((line) => (
                      <span key={line} className="block">{line}</span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          )}
          {company.website ? (
            <a href={company.website} className="mt-3 inline-block text-sm hover:underline" rel="noreferrer" target="_blank">{company.website}</a>
          ) : null}
        </div>
        <div>
          <Heading as="h2" size="h4">Kontakte</Heading>
          {company.contacts.length === 0 ? <p className="mt-3 text-sm">Keine sichtbaren Kontakte.</p> : (
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {company.contacts.map((contact) => (
                <li key={contact.displayId}>
                  <Link href={`/kontakte/${contact.displayId}`} className="font-medium text-black hover:underline dark:text-white">
                    <span className="mr-2 font-mono text-neutral-400">{formatDisplayId(contact.displayId)}</span>
                    {formatContactName(contact.firstName, contact.lastName)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="md:col-span-2">
          <Heading as="h2" size="h4">Projekte</Heading>
          {company.projects.length === 0 ? <p className="mt-3 text-sm">Keine Projekte.</p> : (
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {company.projects.map((project) => (
                <li key={project.id} className="flex items-center gap-2">
                  <ProjectBadge projectKey={project.key} companyId={project.companyId} logoKey={company.logoKey} />
                  <Link href={`/projekte/${project.slug}`} className="font-medium text-black hover:underline dark:text-white">{project.title}</Link>
                  <span>· {projectStatusLabel(project.status)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
