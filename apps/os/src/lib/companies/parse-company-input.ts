import { parseHttpsUrl } from '@/lib/contacts/parse-https-url'
import { readOptionalText } from '@/lib/contacts/read-optional-text'

export type CompanyInput = {
  name: string
  logoUrl: string | null
  website: string | null
  street: string | null
  postalCode: string | null
  city: string | null
  country: string | null
}

/** Name, logo, postal address, and website. There is no phone field. */
export const parseCompanyInput = (formData: FormData): { ok: true; value: CompanyInput } | { ok: false; message: string } => {
  const name = readOptionalText(formData.get('name'), 200)
  if (!name) return { ok: false, message: 'Name ist erforderlich.' }

  const logo = parseHttpsUrl(formData.get('logoUrl'))
  if (!logo.ok) return { ok: false, message: 'Logo muss eine https-URL sein.' }
  const website = parseHttpsUrl(formData.get('website'))
  if (!website.ok) return { ok: false, message: 'Website muss eine https-URL sein.' }

  return {
    ok: true,
    value: {
      name,
      logoUrl: logo.value,
      website: website.value,
      street: readOptionalText(formData.get('street'), 200),
      postalCode: readOptionalText(formData.get('postalCode'), 20),
      city: readOptionalText(formData.get('city'), 100),
      country: readOptionalText(formData.get('country'), 100),
    },
  }
}
