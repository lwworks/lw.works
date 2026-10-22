export class GoogleCalendarError extends Error {
  constructor(
    readonly status: number,
    readonly reasons: string[],
    message: string,
  ) {
    super(message)
  }

  get isRateLimited() {
    return this.status === 429 || this.reasons.some((reason) => reason === 'rateLimitExceeded' || reason === 'userRateLimitExceeded')
  }

  get isMissingScope() {
    return this.status === 403 && this.reasons.some((reason) => reason === 'insufficientPermissions' || reason === 'ACCESS_TOKEN_SCOPE_INSUFFICIENT')
  }
}
