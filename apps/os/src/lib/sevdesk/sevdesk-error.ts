/** A failed SevDesk API request. The message never contains the token. */
export class SevdeskError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'SevdeskError'
  }
}
