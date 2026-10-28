import { describe, expect, it } from 'vitest'
import { proxiesThroughProduction } from '@/lib/auth/proxies-through-production'

const preview = {
  VERCEL_ENV: 'preview',
  VERCEL_BRANCH_URL: 'lw-os-git-cursor-preview-login-redirect-da61-lw-works.vercel.app',
  VERCEL_URL: 'lw-pv4vsqnbp-lw-works.vercel.app',
}

describe('proxiesThroughProduction', () => {
  it('is true on lw-os previews without BETTER_AUTH_URL', () => {
    expect(proxiesThroughProduction(preview)).toBe(true)
  })

  it('is false when the preview sets its own BETTER_AUTH_URL', () => {
    expect(proxiesThroughProduction({ ...preview, BETTER_AUTH_URL: `https://${preview.VERCEL_BRANCH_URL}` })).toBe(false)
  })

  it('is false in production and locally', () => {
    expect(proxiesThroughProduction({ ...preview, VERCEL_ENV: 'production', BETTER_AUTH_URL: 'https://os.lw.works' })).toBe(false)
    expect(proxiesThroughProduction({ BETTER_AUTH_URL: 'http://localhost:3001' })).toBe(false)
  })
})
