import { createHmac } from 'node:crypto'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { handleWebhook } from './handle-webhook'

const secret = 'test-signing-secret'
const routineUrl = 'https://routine.example/hook'
const graphQL = 'https://api.linear.app/graphql'
const timestamp = 1_800_000_000_000
const issue = { id: 'issue', identifier: 'LW-42', title: 'Test', url: 'https://linear.app/issue/LW-42' }
const creator = { id: 'user', name: 'Lukas', email: 'LUKAS@LW.WORKS' }

const created = {
  type: 'AgentSessionEvent',
  action: 'created',
  webhookTimestamp: timestamp,
  organizationId: 'org',
  promptContext: '<issue />',
  agentSession: {
    id: 'session',
    issue: { ...issue, description: 'Excluded from issue object' },
    commentId: 'comment',
    creator: { ...creator, url: 'https://linear.app/profile' },
  },
  previousComments: [{ body: 'Excluded' }],
}

function sign(body: string) {
  return createHmac('sha256', secret).update(body).digest('hex')
}

function prepare(payload: unknown, signature?: (body: string) => string) {
  const body = JSON.stringify(payload, null, 2)
  const request = new Request('https://automation.lw.works/linear/agent', {
    method: 'POST',
    headers: { 'Linear-Signature': (signature ?? sign)(body) },
    body,
  })
  const tasks: (() => Promise<void>)[] = []
  return { tasks, handle: () => handleWebhook(request, (task) => tasks.push(task)) }
}

const fakeFetch = vi.fn<(url: string, init: RequestInit) => Promise<Response>>(async (url) => {
  switch (url) {
    case 'https://api.linear.app/oauth/token':
      return Response.json({ access_token: 'app-token', expires_in: 30 })
    case graphQL:
      return Response.json({ data: { agentActivityCreate: { success: true } } })
    case routineUrl:
      return new Response(null, { status: 200 })
    default:
      throw new Error('Unexpected URL')
  }
})

function activityTypes() {
  return fakeFetch.mock.calls
    .filter(([url]) => url === graphQL)
    .map(([, init]) => JSON.parse(String(init.body)).variables.input.content.type)
}

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(timestamp)
  vi.stubEnv('LINEAR_WEBHOOK_SECRET', secret)
  vi.stubEnv('LINEAR_CLIENT_ID', 'client')
  vi.stubEnv('LINEAR_CLIENT_SECRET', 'test-client-secret')
  vi.stubEnv('LINEAR_SCOPES', undefined)
  vi.stubEnv('ROUTINE_WEBHOOK_URL', routineUrl)
  vi.stubEnv('ROUTINE_WEBHOOK_KEY', 'test-routine-key')
  vi.stubEnv('ALLOWED_EMAILS', ' LukAs@lw.works , other@example.com ')
  vi.stubGlobal('fetch', fakeFetch)
  fakeFetch.mockClear()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('Linear agent webhook', () => {
  it.each([
    ['wrong bytes', (body: string) => sign(body.trimStart().replace(/\n/g, ''))],
    ['malformed hex', (body: string) => sign(body) + '00'],
    ['missing signature', () => ''],
  ])('rejects %s', async (_label, signature) => {
    const { handle, tasks } = prepare(created, signature)
    expect(await handle()).toBe(401)
    expect(tasks).toHaveLength(0)
  })

  it.each([undefined, null, String(timestamp), timestamp - 60_001, timestamp + 60_001])(
    'rejects timestamp %s',
    async (webhookTimestamp) => {
      const { handle, tasks } = prepare({ ...created, webhookTimestamp })
      expect(await handle()).toBe(401)
      expect(tasks).toHaveLength(0)
    },
  )

  it('returns 200 at the 60-second boundary before posting the thought and forwarding the mapped payload', async () => {
    const webhookTimestamp = timestamp - 60_000
    const { handle, tasks } = prepare({ ...created, webhookTimestamp })
    expect(await handle()).toBe(200)
    expect(fakeFetch).not.toHaveBeenCalled()
    expect(tasks).toHaveLength(1)

    await tasks[0]()
    expect(fakeFetch.mock.calls.map(([url]) => url)).toEqual([
      'https://api.linear.app/oauth/token', graphQL, routineUrl,
    ])
    expect(Object.fromEntries(new URLSearchParams(String(fakeFetch.mock.calls[0][1].body)))).toEqual({
      grant_type: 'client_credentials',
      client_id: 'client',
      client_secret: 'test-client-secret',
      scope: 'read,write,app:mentionable,app:assignable',
    })
    expect(JSON.parse(String(fakeFetch.mock.calls[1][1].body)).variables.input).toEqual({
      agentSessionId: 'session',
      content: { type: 'thought', body: 'Atlas schaut sich das an …' },
    })
    const [, request] = fakeFetch.mock.calls[2]
    expect(request.method).toBe('POST')
    expect(new Headers(request.headers).get('authorization')).toBe('Bearer test-routine-key')
    expect(JSON.parse(String(request.body))).toEqual({
      source: 'linear-agent-session',
      action: 'created',
      organizationId: 'org',
      agentSessionId: 'session',
      issue,
      commentId: 'comment',
      creator,
      promptContext: '<issue />',
      webhookTimestamp,
    })
  })

  it.each([undefined, 'unauthorized@example.com'])('denies a created event with email %s', async (email) => {
    const { handle, tasks } = prepare({
      ...created,
      agentSession: { ...created.agentSession, creator: { ...creator, email } },
    })
    expect(await handle()).toBe(200)
    await tasks[0]()
    expect(activityTypes()).toEqual(['error'])
    expect(fakeFetch.mock.calls.some(([url]) => url === routineUrl)).toBe(false)
  })

  it('checks the prompted sender even when the session creator is allowed', async () => {
    const { handle, tasks } = prepare({
      ...created,
      action: 'prompted',
      agentActivity: { user: { email: 'unauthorized@example.com' }, content: { body: 'Weiter' } },
    })
    expect(await handle()).toBe(200)
    await tasks[0]()
    expect(activityTypes()).toEqual(['error'])
    expect(fakeFetch.mock.calls.some(([url]) => url === routineUrl)).toBe(false)
  })

  it('accepts the allowed prompted sender and maps the message and signal', async () => {
    const { handle, tasks } = prepare({
      ...created,
      action: 'prompted',
      agentSession: { ...created.agentSession, creator: null },
      agentActivity: { user: creator, content: { type: 'prompt', body: 'Stopp' }, signal: 'stop' },
    })
    expect(await handle()).toBe(200)
    await tasks[0]()
    const routine = fakeFetch.mock.calls.find(([url]) => url === routineUrl)
    expect(JSON.parse(String(routine?.[1].body))).toEqual({
      source: 'linear-agent-session',
      organizationId: 'org',
      action: 'prompted',
      agentSessionId: 'session',
      issue,
      commentId: 'comment',
      creator: null,
      promptBody: 'Stopp',
      signal: 'stop',
      webhookTimestamp: timestamp,
    })
  })

  it.each([{ action: 'updated' }, { type: 'PermissionChange' }])('ignores unsupported events %j', async (override) => {
    const { handle, tasks } = prepare({ ...created, ...override })
    expect(await handle()).toBe(200)
    expect(tasks).toHaveLength(0)
  })

  it('returns 500 and logs variable names for invalid configuration', async () => {
    vi.stubEnv('ALLOWED_EMAILS', ' , ')
    vi.stubEnv('ROUTINE_WEBHOOK_KEY', undefined)
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { handle, tasks } = prepare(created)
    expect(await handle()).toBe(500)
    expect(tasks).toHaveLength(0)
    expect(log).toHaveBeenCalledWith(expect.any(String), ['ROUTINE_WEBHOOK_KEY', 'ALLOWED_EMAILS'])
  })

  it.each(['Linear GraphQL', 'Routine'])('posts an error after %s failure', async (upstream) => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    fakeFetch.mockImplementationOnce(async () => Response.json({ access_token: 'test', expires_in: 30 }))
    if (upstream === 'Linear GraphQL') {
      fakeFetch.mockImplementationOnce(async () => Response.json({ errors: [{ message: 'Failed' }] }))
    } else {
      fakeFetch
        .mockImplementationOnce(async () => Response.json({ data: { agentActivityCreate: { success: true } } }))
        .mockImplementationOnce(async () => new Response(null, { status: 502 }))
    }

    const { handle, tasks } = prepare(created)
    expect(await handle()).toBe(200)
    await tasks[0]()
    expect(activityTypes()).toEqual(['thought', 'error'])
    expect(fakeFetch.mock.calls.some(([url]) => url === routineUrl)).toBe(upstream === 'Routine')
  })
})
