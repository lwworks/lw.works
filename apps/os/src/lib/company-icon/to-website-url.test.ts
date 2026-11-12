import { describe, expect, it } from 'vitest'
import { toWebsiteUrl } from './to-website-url'

describe('toWebsiteUrl', () => {
  it('adds https to a bare domain', () => {
    expect(toWebsiteUrl('example.com')?.href).toBe('https://example.com/')
  })
  it('keeps an explicit scheme and path', () => {
    expect(toWebsiteUrl('http://www.example.com/de')?.href).toBe('http://www.example.com/de')
  })
  it('rejects empty and invalid input', () => {
    expect(toWebsiteUrl(null)).toBeNull()
    expect(toWebsiteUrl('  ')).toBeNull()
    expect(toWebsiteUrl('ftp://example.com')).toBeNull()
  })
  it('rejects internal hosts', () => {
    expect(toWebsiteUrl('localhost')).toBeNull()
    expect(toWebsiteUrl('http://127.0.0.1')).toBeNull()
    expect(toWebsiteUrl('http://[::1]')).toBeNull()
    expect(toWebsiteUrl('http://intranet')).toBeNull()
    expect(toWebsiteUrl('https://example.com:8080')).toBeNull()
  })
})
