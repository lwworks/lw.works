import { describe, expect, it } from 'vitest'
import { isPublicAddress } from './is-public-address'

describe('isPublicAddress', () => {
  it('accepts public addresses', () => {
    for (const address of ['8.8.8.8', '76.76.21.21', '2606:4700:4700::1111', '2a00:1450:4001:80b::200e']) {
      expect(isPublicAddress(address), address).toBe(true)
    }
  })
  it('rejects loopback, private, link-local, metadata and reserved ranges', () => {
    for (const address of [
      '127.0.0.1', '10.1.2.3', '172.16.0.1', '172.31.255.255', '192.168.1.1', '169.254.169.254', '100.64.0.1',
      '0.0.0.0', '224.0.0.1', '255.255.255.255', '198.18.0.1',
      '::1', '::', 'fe80::1', 'fd00::1', 'fc00::1', 'ff02::1', '::ffff:127.0.0.1', '::ffff:10.0.0.1', '64:ff9b::a00:1', '2002:7f00:1::1',
    ]) {
      expect(isPublicAddress(address), address).toBe(false)
    }
  })
  it('accepts an IPv4-mapped public address', () => {
    expect(isPublicAddress('::ffff:8.8.8.8')).toBe(true)
  })
  it('rejects non-addresses', () => {
    expect(isPublicAddress('example.com')).toBe(false)
    expect(isPublicAddress('')).toBe(false)
  })
})
