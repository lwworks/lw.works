import { describe, expect, it } from 'vitest'
import { planAccountPush } from '@/lib/google-contacts-sync/plan-account-push'

describe('planAccountPush', () => {
  it('deletes a stored Google contact that is outside the audience', () => {
    expect(planAccountPush({ inAudience: false, hasScope: true, hasResourceName: true })).toBe('delete')
    expect(planAccountPush({ inAudience: false, hasScope: false, hasResourceName: false })).toBe('skip')
  })

  it('records a missing scope and does not call Google', () => {
    expect(planAccountPush({ inAudience: true, hasScope: false, hasResourceName: false })).toBe('missing-scope')
  })

  it('creates or updates when the account is in the audience and has the scope', () => {
    expect(planAccountPush({ inAudience: true, hasScope: true, hasResourceName: false })).toBe('upsert')
    expect(planAccountPush({ inAudience: true, hasScope: true, hasResourceName: true })).toBe('upsert')
  })
})
