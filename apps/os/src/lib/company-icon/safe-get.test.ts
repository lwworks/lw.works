import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
// The test server runs on loopback, so treat 127.0.0.1 as "public" here and allow its port; `internal.test` stays
// internal (it resolves to 10.0.0.1 below).
vi.mock('@/lib/company-icon/is-public-address', () => ({ isPublicAddress: (address: string) => address === '127.0.0.1' }))
vi.mock('@/lib/company-icon/to-website-url', () => ({
  toWebsiteUrl: (value: string | null) => {
    try {
      return value ? new URL(value) : null
    } catch {
      return null
    }
  },
}))
vi.mock('node:dns', () => ({
  lookup: (hostname: string, _options: unknown, callback: (error: Error | null, addresses: unknown) => void) =>
    callback(null, [{ address: hostname === 'internal.test' ? '10.0.0.1' : '127.0.0.1', family: 4 }]),
}))

const { safeGet } = await import('./safe-get')

let server: Server
let origin: string

beforeAll(async () => {
  server = createServer((request, response) => {
    const port = (server.address() as AddressInfo).port
    if (request.url === '/to-internal') return response.writeHead(302, { location: `http://internal.test:${port}/secret` }).end()
    if (request.url === '/to-public') return response.writeHead(301, { location: '/hello' }).end()
    if (request.url === '/loop') return response.writeHead(302, { location: '/loop' }).end()
    if (request.url === '/big') return response.end('x'.repeat(2048))
    response.writeHead(200, { 'content-type': 'text/plain' }).end('hello')
  })
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
  origin = `http://public.test:${(server.address() as AddressInfo).port}`
})

afterAll(() => {
  server.close()
})

describe('safeGet', () => {
  it('reads a response and follows a redirect to an allowed host', async () => {
    const response = await safeGet(`${origin}/to-public`, { accept: '*/*', maxBytes: 1024 })
    expect(response?.status).toBe(200)
    expect(response?.url.pathname).toBe('/hello')
    expect(new TextDecoder().decode(response?.body)).toBe('hello')
  })

  it('refuses a redirect to a host that resolves to an internal address', async () => {
    expect(await safeGet(`${origin}/to-internal`, { accept: '*/*', maxBytes: 1024 })).toBeNull()
  })

  it('refuses a host that resolves to an internal address', async () => {
    const port = (server.address() as AddressInfo).port
    expect(await safeGet(`http://internal.test:${port}/`, { accept: '*/*', maxBytes: 1024 })).toBeNull()
  })

  it('stops after too many redirects', async () => {
    expect(await safeGet(`${origin}/loop`, { accept: '*/*', maxBytes: 1024 })).toBeNull()
  })

  it('fails or truncates bodies over the limit', async () => {
    expect(await safeGet(`${origin}/big`, { accept: '*/*', maxBytes: 1000 })).toBeNull()
    const truncated = await safeGet(`${origin}/big`, { accept: '*/*', maxBytes: 1000, truncate: true })
    expect(truncated?.body.byteLength).toBe(1000)
  })
})
