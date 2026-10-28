/** Ends the session. Resolves to `false` instead of throwing, also when the auth client fails to load. */
export const signOut = async (): Promise<boolean> => {
  try {
    const { authClient } = await import('@/lib/auth/auth-client')
    const { error } = await authClient.signOut()
    return !error
  } catch {
    return false
  }
}
