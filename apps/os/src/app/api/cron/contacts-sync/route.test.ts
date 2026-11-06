import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/google-contacts-sync/pull-contacts', () => ({
  pullContacts: vi.fn(async () => ({ accounts: 0, updated: 0, skipped: 0, failed: 0 })),
}))

import { GET } from '@/app/api/cron/contacts-sync/route'
import { pullContacts } from '@/lib/google-contacts-sync/pull-contacts'

describe('GET /api/cron/contacts-sync', () => {
  it('returns 401 without the cron secret and does not pull', async () => {
    vi.stubEnv('CRON_SECRET', 'secret')
    const response = await GET(new Request('http://localhost/api/cron/contacts-sync'))
    expect(response.status).toBe(401)
    expect(pullContacts).not.toHaveBeenCalled()
  })

  it('pulls when the bearer secret matches', async () => {
    vi.stubEnv('CRON_SECRET', 'secret')
    const response = await GET(new Request('http://localhost/api/cron/contacts-sync', { headers: { Authorization: 'Bearer secret' } }))
    expect(response.status).toBe(200)
    expect(pullContacts).toHaveBeenCalledOnce()
  })
})
