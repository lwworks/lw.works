import 'server-only'

import { lookup as dnsLookup } from 'node:dns'
import { request as httpRequest, type IncomingMessage } from 'node:http'
import { request as httpsRequest } from 'node:https'
import type { LookupFunction } from 'node:net'
import { createBrotliDecompress, createGunzip, createInflate } from 'node:zlib'
import { isPublicAddress } from '@/lib/company-icon/is-public-address'
import { toWebsiteUrl } from '@/lib/company-icon/to-website-url'

export type SafeResponse = { status: number; url: URL; contentType: string; body: Uint8Array }

const maxRedirects = 3
const timeoutMs = 5000

/**
 * GET for URLs that users control (company websites, their favicons) without SSRF: every hop must pass
 * `toWebsiteUrl`, and the IP address is checked when the socket connects (so a public name that resolves to — or is
 * rebound to — loopback, a private network or cloud metadata is refused). Redirects are followed by hand, each
 * re-checked. The body is cut at `maxBytes` (`truncate`) or the request fails. Null on any error.
 */
export const safeGet = async (
  url: string | URL,
  { accept, maxBytes, truncate = false }: { accept: string; maxBytes: number; truncate?: boolean },
): Promise<SafeResponse | null> => {
  const deadline = Date.now() + timeoutMs
  let current = toWebsiteUrl(String(url))
  for (let hop = 0; current && hop <= maxRedirects; hop++) {
    const response = await requestOnce(current, accept, deadline)
    if (!response) return null
    const location = response.headers.location
    if (response.statusCode && response.statusCode >= 300 && response.statusCode < 400 && location) {
      response.resume()
      let next: URL
      try {
        next = new URL(location, current)
      } catch {
        return null
      }
      current = toWebsiteUrl(next.href)
      continue
    }
    const body = await readBody(response, maxBytes, truncate, deadline)
    if (!body) return null
    return {
      status: response.statusCode ?? 0,
      url: current,
      contentType: (response.headers['content-type'] ?? '').toLowerCase(),
      body,
    }
  }
  return null
}

/** Resolves like `dns.lookup`, but fails unless every address of the host is public. */
const publicOnlyLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (error, addresses) => {
    if (error) return callback(error, '', 0)
    const list = addresses as unknown as { address: string; family: number }[]
    if (list.length === 0 || !list.every((entry) => isPublicAddress(entry.address))) {
      return callback(Object.assign(new Error(`Refusing non-public address for ${hostname}`), { code: 'EADDRNOTPUBLIC' }), '', 0)
    }
    if (options.all) return (callback as unknown as (error: null, addresses: typeof list) => void)(null, list)
    callback(null, list[0].address, list[0].family)
  })
}

const requestOnce = (url: URL, accept: string, deadline: number) =>
  new Promise<IncomingMessage | null>((resolve) => {
    const remaining = deadline - Date.now()
    if (remaining <= 0) return resolve(null)
    const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)(
      url,
      {
        method: 'GET',
        lookup: publicOnlyLookup,
        headers: {
          'user-agent': 'Mozilla/5.0 (compatible; lw.works OS favicon fetcher)',
          accept,
          'accept-encoding': 'gzip, deflate, br',
        },
        timeout: remaining,
      },
      resolve,
    )
    request.on('timeout', () => request.destroy())
    request.on('error', () => resolve(null))
    request.end()
  })

const readBody = (response: IncomingMessage, maxBytes: number, truncate: boolean, deadline: number) =>
  new Promise<Uint8Array | null>((resolve) => {
    const encoding = (response.headers['content-encoding'] ?? '').toLowerCase()
    const decoder =
      encoding === 'gzip' ? createGunzip() : encoding === 'deflate' ? createInflate() : encoding === 'br' ? createBrotliDecompress() : null
    const stream = decoder ? response.pipe(decoder) : response
    const chunks: Buffer[] = []
    let size = 0
    let done = false
    const finish = (value: Uint8Array | null) => {
      if (done) return
      done = true
      clearTimeout(timer)
      response.destroy()
      decoder?.destroy()
      resolve(value)
    }
    const timer = setTimeout(() => finish(null), Math.max(0, deadline - Date.now()))
    stream.on('data', (chunk: Buffer) => {
      if (done) return
      if (size + chunk.byteLength > maxBytes) {
        if (!truncate) return finish(null)
        chunks.push(chunk.subarray(0, maxBytes - size))
        return finish(new Uint8Array(Buffer.concat(chunks)))
      }
      chunks.push(chunk)
      size += chunk.byteLength
    })
    stream.on('end', () => finish(new Uint8Array(Buffer.concat(chunks))))
    stream.on('error', () => finish(null))
    response.on('error', () => finish(null))
  })
