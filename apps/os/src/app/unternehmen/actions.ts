'use server'

import { applyWebsiteFavicon } from '@/lib/company-logo/apply-website-favicon'
import { uploadCompanyLogo } from '@/lib/company-logo/upload-company-logo'
import { createCompany } from '@/lib/companies/create-company'
import { removeCompany } from '@/lib/companies/remove-company'
import { saveCompany } from '@/lib/companies/save-company'
import { refresh } from 'next/cache'
import { redirect } from 'next/navigation'

type FormActionState = { ok: true } | { ok: false; message: string } | null

export async function createCompanyAction(_prev: FormActionState, formData: FormData) {
  const result = await createCompany(formData)
  if (!result.ok) return result
  refresh()
  redirect(`/unternehmen/${result.id}`)
}

export async function saveCompanyAction(id: string, _prev: FormActionState, formData: FormData) {
  const result = await saveCompany(id, formData)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function removeCompanyAction(id: string) {
  const result = await removeCompany(id)
  if (!result.ok) return result
  refresh()
  redirect('/unternehmen')
}

export async function uploadCompanyLogoAction(id: string, formData: FormData) {
  const result = await uploadCompanyLogo(id, formData)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}

export async function applyWebsiteFaviconAction(id: string) {
  const result = await applyWebsiteFavicon(id)
  if (!result.ok) return result
  refresh()
  return { ok: true as const }
}
