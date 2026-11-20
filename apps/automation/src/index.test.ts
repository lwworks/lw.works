import { afterEach, describe, expect, it, vi } from 'vitest'

import app from './index'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('automation app', () => {
  it('answers the health check', async () => {
    const response = await app.request('/')
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
  })

  it('routes Linear agent webhooks to the relay', async () => {
    vi.stubEnv('LINEAR_WEBHOOK_SECRET', 'secret')
    vi.stubEnv('LINEAR_CLIENT_ID', 'client')
    vi.stubEnv('LINEAR_CLIENT_SECRET', 'client-secret')
    vi.stubEnv('ROUTINE_WEBHOOK_URL', 'https://routine.example/hook')
    vi.stubEnv('ROUTINE_WEBHOOK_KEY', 'key')
    vi.stubEnv('ALLOWED_EMAILS', 'lukas@lw.works')

    const response = await app.request('/linear/agent', { method: 'POST', body: '{}' })
    expect(response.status).toBe(401)
  })

  it('rejects other methods and paths', async () => {
    expect((await app.request('/linear/agent')).status).toBe(404)
    expect((await app.request('/unknown', { method: 'POST' })).status).toBe(404)
  })
})
