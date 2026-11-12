import { readOptionalText } from '@/lib/contacts/read-optional-text'

export type CompanyLocationInput = {
  /** Set for a location that already exists; null for a new one. */
  id: string | null
  label: string | null
  street: string | null
  postalCode: string | null
  city: string | null
  country: string | null
}

export type CompanyInput = {
  name: string
  logoUrl: string | null
  website: string | null
  locations: CompanyLocationInput[]
}

const maxLocations = 50

/**
 * Name, logo, website, and any number of locations. Logo and website are stored as entered. There is no phone field.
 * Location fields repeat once per location (`locationId`, `locationLabel`, `street`, `postalCode`, `city`, `country`) and are read by position.
 * Locations with no label and no address are dropped.
 */
export const parseCompanyInput = (formData: FormData): { ok: true; value: CompanyInput } | { ok: false; message: string } => {
  const name = readOptionalText(formData.get('name'), 200)
  if (!name) return { ok: false, message: 'Name ist erforderlich.' }

  const column = (key: string) => formData.getAll(key)
  const ids = column('locationId')
  const labels = column('locationLabel')
  const streets = column('street')
  const postalCodes = column('postalCode')
  const cities = column('city')
  const countries = column('country')
  const count = Math.max(ids.length, labels.length, streets.length, postalCodes.length, cities.length, countries.length)

  const locations: CompanyLocationInput[] = []
  for (let index = 0; index < count; index++) {
    const location = {
      id: readOptionalText(ids[index] ?? null, 80),
      label: readOptionalText(labels[index] ?? null, 100),
      street: readOptionalText(streets[index] ?? null, 200),
      postalCode: readOptionalText(postalCodes[index] ?? null, 20),
      city: readOptionalText(cities[index] ?? null, 100),
      country: readOptionalText(countries[index] ?? null, 100),
    }
    if (location.label || location.street || location.postalCode || location.city || location.country) locations.push(location)
  }
  if (locations.length > maxLocations) return { ok: false, message: `Höchstens ${maxLocations} Standorte.` }

  return {
    ok: true,
    value: {
      name,
      logoUrl: readOptionalText(formData.get('logoUrl'), 500),
      website: readOptionalText(formData.get('website'), 500),
      locations,
    },
  }
}
