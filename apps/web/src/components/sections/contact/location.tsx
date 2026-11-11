import { Brow } from "@lw/ui/atoms/brow"
import { Heading } from "@lw/ui/atoms/heading"
import { cn } from "@lw/ui/lib/utils"
import { Section, verticalPaddings } from "@/components/sections"
import { company } from "@/content/company"
import { Button } from "@lw/ui/components/button"
import { ArrowUpRight } from "@mynaui/icons-react"
import Link from "next/link"
import { MapEmbed } from "./map-embed"

const { street, postalCode, city, country } = company.address
const query = `${company.name}, ${street}, ${postalCode} ${city}`

export const ContactLocationSection = () => {
  return (
    <Section id="standort" verticalPadding="none" horizontalPadding="none">
      <div className="lg:grid lg:grid-cols-3">
        <div className={cn("px-4 sm:px-8 lg:pl-16 lg:pr-8", verticalPaddings.small)}>
          <Brow className="mb-2">Standort</Brow>
          <Heading as="h2">Unser Office</Heading>
          <address className="mt-6 not-italic">
            <span className="block text-black dark:text-white font-medium">{company.name}</span>
            <span className="block">{street}</span>
            <span className="block">{postalCode} {city}</span>
            <span className="block">{country}</span>
          </address>
          <Button variant="outline" asChild className="mt-6">
            <Link href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">
              <span>In Maps öffnen</span>
              <ArrowUpRight strokeWidth={2} className="size-4 opacity-50" />
            </Link>
          </Button>
        </div>
        {/* Inset by 1px so the map does not cover the section's side and bottom borders. */}
        <div className="relative mx-px mb-px lg:ml-0 min-h-80 border-t lg:border-t-0 lg:border-l border-black/10 dark:border-white/10 lg:col-span-2">
          <MapEmbed coordinates={company.address.coordinates} label={company.name} />
        </div>
      </div>
    </Section>
  )
}
