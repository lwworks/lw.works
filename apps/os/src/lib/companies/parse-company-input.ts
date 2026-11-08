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

/** Name, logo, postal address, and website. Logo and website are stored as entered. There is no phone field. */
export const parseCompanyInput = (formData: FormData): { ok: true; value: CompanyInput } | { ok: false; message: string } => {
  const name = readOptionalText(formData.get('name'), 200)
  if (!name) return { ok: false, message: 'Name ist erforderlich.' }

  return {
    ok: true,
    value: {
      name,
      logoUrl: readOptionalText(formData.get('logoUrl'), 500),
      website: readOptionalText(formData.get('website'), 500),
      street: readOptionalText(formData.get('street'), 200),
      postalCode: readOptionalText(formData.get('postalCode'), 20),
      city: readOptionalText(formData.get('city'), 100),
      country: readOptionalText(formData.get('country'), 100),
    },
  }
}
