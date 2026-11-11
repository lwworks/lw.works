'use client'

import { grantConsent, useStoredConsent } from "@/lib/consent"
import { Button } from "@lw/ui/components/button"
import { MapPin } from "@mynaui/icons-react"
import NextLink from "next/link"
import { GoogleMap } from "./google-map"

type MapEmbedProps = {
  coordinates: google.maps.LatLngLiteral
  label: string
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID

/**
 * Google Maps gated by the "maps" category of the cookie banner.
 * Nothing is loaded from Google until the visitor has consented.
 * Requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`; without it only the empty placeholder is shown.
 */
export const MapEmbed = ({ coordinates, label }: MapEmbedProps) => {
  const consent = useStoredConsent()

  // Without an API key there is no map at all: the keyless embed always shows Google's place card.
  if (apiKey && consent?.includes('maps')) {
    return <GoogleMap apiKey={apiKey} mapId={mapId} coordinates={coordinates} label={label} />
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="absolute inset-0 bg-pattern-stripes" />
      {/* Before hydration and while the cookie banner is still undecided, show only the empty placeholder. */}
      {apiKey && consent && (
        <>
          <MapPin className="relative size-6 text-black dark:text-white" />
          <p className="relative max-w-xs text-sm text-balance">
            Beim Laden der Karte werden Daten an Google übertragen. Mehr dazu in unserer{" "}
            <NextLink href="/datenschutz#google-maps" className="underline underline-offset-2 hover:text-black dark:hover:text-white">Datenschutzerklärung</NextLink>.
          </p>
          <Button variant="outline" className="relative" onClick={() => grantConsent('maps')}>Karte laden</Button>
        </>
      )}
    </div>
  )
}
