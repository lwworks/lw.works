import { fetchCompanyIcon } from '@/lib/company-icon/fetch-company-icon'
import { importCompanyLogo } from '@/lib/company-logo/import-company-logo'
import { logoVersion } from '@/lib/company-logo/logo-version'
import { getCompanyLogoState } from '@/lib/db/companies/get-company-logo-state'
import { getObject } from '@/lib/object-storage/get-object'
import { getStorage } from '@/lib/object-storage/get-storage'
import type { NextRequest } from 'next/server'

/**
 * The company's logo from the bucket. A company that was never checked (created before logos were stored, or whose
 * background import didn't run) gets its one-time import here. Without a configured bucket (local dev) the favicon is
 * fetched live instead. Falls back to a neutral placeholder.
 *
 * `?v=` is the logo version the page rendered with (`logoVersion`): when it matches, the image is cached for good.
 */
export async function GET(request: NextRequest, ctx: RouteContext<'/unternehmen/[companyId]/icon'>) {
  const { companyId } = await ctx.params
  const state = await getCompanyLogoState(companyId)
  if (!state) return new Response('Not found.', { status: 404 })

  const storage = getStorage()
  if (!storage) {
    const icon = await fetchCompanyIcon(state.website)
    return icon ? image(icon.body, icon.contentType, 'private, max-age=3600') : placeholder()
  }

  const key = state.logoKey ?? (state.logoCheckedAt ? null : await importCompanyLogo(companyId))
  const stored = key ? await getObject(storage, key) : null
  if (!stored) return placeholder()

  const current = request.nextUrl.searchParams.get('v') === logoVersion(key)
  return image(stored.body, stored.contentType, current ? 'private, max-age=31536000, immutable' : 'private, max-age=60')
}

const image = (body: Uint8Array, contentType: string, cacheControl: string) =>
  new Response(body as BodyInit, {
    headers: {
      'content-type': contentType,
      'cache-control': cacheControl,
      // Logos come from third-party sites and uploads: an SVG opened directly must not run scripts on this origin.
      'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'x-content-type-options': 'nosniff',
    },
  })

// Short cache: a logo may still arrive from the background import.
const placeholder = () =>
  new Response(placeholderSvg, {
    headers: { 'content-type': 'image/svg+xml', 'cache-control': 'private, max-age=300', 'x-content-type-options': 'nosniff' },
  })

const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#a3a3a3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h2a2 2 0 0 1 2 2v10"/><path d="M3 21h18"/><path d="M8 7h4M8 11h4M8 15h4"/></svg>`
