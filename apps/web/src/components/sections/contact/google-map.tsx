'use client'

import { AdvancedMarker, AdvancedMarkerAnchorPoint, APIProvider, ColorScheme, Map } from "@vis.gl/react-google-maps"
import { useTheme } from "next-themes"

type LatLng = google.maps.LatLngLiteral

type GoogleMapProps = {
  apiKey: string
  /** Map ID from the Google Cloud console; carries the custom map style. */
  mapId?: string
  coordinates: LatLng
  label: string
}

const MapContent = ({ mapId, coordinates: position, label }: Omit<GoogleMapProps, "apiKey">) => {
  const { resolvedTheme } = useTheme()
  const colorScheme = resolvedTheme === "dark" ? ColorScheme.DARK : ColorScheme.LIGHT

  return (
    <Map
      // The color scheme can only be set when the map is created, so remount on theme change.
      key={colorScheme}
      mapId={mapId ?? "DEMO_MAP_ID"}
      colorScheme={colorScheme}
      defaultCenter={position}
      defaultZoom={14}
      gestureHandling="cooperative"
      disableDefaultUI
      zoomControl
      className="absolute inset-0"
    >
      <AdvancedMarker position={position} anchorPoint={AdvancedMarkerAnchorPoint.BOTTOM_CENTER} title={label}>
        <div className="flex flex-col items-center drop-shadow-md">
          <div className="whitespace-nowrap rounded-full border border-lime-dark bg-lime px-3 py-1.5 text-sm font-semibold text-black">{label}</div>
          <div className="-mt-px size-0 border-x-6 border-t-8 border-x-transparent border-t-lime" />
        </div>
      </AdvancedMarker>
    </Map>
  )
}

export const GoogleMap = ({ apiKey, ...props }: GoogleMapProps) => (
  <APIProvider apiKey={apiKey} language="de" region="DE">
    <MapContent {...props} />
  </APIProvider>
)
