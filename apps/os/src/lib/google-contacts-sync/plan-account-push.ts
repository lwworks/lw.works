export type AccountPushPlan = 'delete' | 'missing-scope' | 'upsert' | 'skip'

/** What one member account needs on an outbound push. A missing scope is recorded and skipped. */
export const planAccountPush = ({
  inAudience,
  hasScope,
  hasResourceName,
}: {
  inAudience: boolean
  hasScope: boolean
  hasResourceName: boolean
}): AccountPushPlan => {
  if (!inAudience) return hasResourceName ? 'delete' : 'skip'
  if (!hasScope) return 'missing-scope'
  return 'upsert'
}
