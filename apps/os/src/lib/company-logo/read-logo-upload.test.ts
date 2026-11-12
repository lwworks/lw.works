import { describe, expect, it } from 'vitest'
import { maxLogoUploadBytes, readLogoUpload } from './read-logo-upload'

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

describe('readLogoUpload', () => {
  it('accepts an image by its bytes, whatever its declared type', async () => {
    const result = await readLogoUpload(new File([png], 'logo.txt', { type: 'text/plain' }))
    expect(result).toMatchObject({ ok: true, contentType: 'image/png' })
  })
  it('rejects missing, empty, oversized and non-image files', async () => {
    expect((await readLogoUpload(null)).ok).toBe(false)
    expect((await readLogoUpload(new File([], 'empty.png'))).ok).toBe(false)
    expect((await readLogoUpload(new File([new Uint8Array(maxLogoUploadBytes + 1)], 'big.png'))).ok).toBe(false)
    expect((await readLogoUpload(new File(['<html></html>'], 'x.svg', { type: 'image/svg+xml' }))).ok).toBe(false)
  })
})
