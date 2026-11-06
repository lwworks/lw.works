export class GooglePeopleError extends Error {
  constructor(
    readonly status: number,
    readonly reasons: string[],
    message: string,
  ) {
    super(message)
    this.name = 'GooglePeopleError'
  }

  get isMissingScope() {
    return (
      this.status === 403 &&
      this.reasons.some((reason) => reason === 'insufficientPermissions' || reason === 'ACCESS_TOKEN_SCOPE_INSUFFICIENT' || reason === 'PERMISSION_DENIED')
    )
  }
}
