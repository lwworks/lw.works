import { describe, expect, it } from 'vitest'
import { getPreviewOrigins } from '@/lib/auth/get-preview-origins'

const preview = {
  VERCEL_ENV: 'preview',
  VERCEL_BRANCH_URL: 'lw-os-git-cursor-zeiterfassung-ui-tweaks-8f63-lw-works.vercel.app',
  VERCEL_URL: 'lw-os-a1b2c3d4e-lw-works.vercel.app',
}

describe('getPreviewOrigins', () => {
  it('returns branch and deployment origins on previews, branch first', () => {
    expect(getPreviewOrigins(preview)).toEqual([
      'https://lw-os-git-cursor-zeiterfassung-ui-tweaks-8f63-lw-works.vercel.app',
      'https://lw-os-a1b2c3d4e-lw-works.vercel.app',
    ])
  })

  it('is empty outside previews', () => {
    expect(getPreviewOrigins({ ...preview, VERCEL_ENV: 'production' })).toEqual([])
    expect(getPreviewOrigins({ ...preview, VERCEL_ENV: undefined })).toEqual([])
  })

  it('ignores hosts of other projects or teams', () => {
    expect(
      getPreviewOrigins({
        VERCEL_ENV: 'preview',
        VERCEL_BRANCH_URL: 'lw-web-git-main-lw-works.vercel.app',
        VERCEL_URL: 'lw-os-a1b2c3d4e-other-team.vercel.app',
      }),
    ).toEqual([])
    expect(getPreviewOrigins({ VERCEL_ENV: 'preview', VERCEL_URL: 'evil.com/lw-os-x-lw-works.vercel.app' })).toEqual([])
  })

  it('skips missing values', () => {
    expect(getPreviewOrigins({ VERCEL_ENV: 'preview', VERCEL_URL: preview.VERCEL_URL })).toEqual([
      'https://lw-os-a1b2c3d4e-lw-works.vercel.app',
    ])
  })
})
