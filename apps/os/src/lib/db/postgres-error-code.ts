/** Postgres SQLSTATE from a driver error, including ones wrapped by Drizzle. */
export const postgresErrorCode = (error: unknown) => {
  const seen = new Set<unknown>()
  let current: unknown = error
  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current)
    if ('code' in current && typeof current.code === 'string') return current.code
    current = 'cause' in current ? current.cause : undefined
  }
  return null
}
