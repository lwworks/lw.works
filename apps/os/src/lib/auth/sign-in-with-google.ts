/** Starts Google sign-in (the browser leaves the page on success). Resolves to `false` instead of throwing. */
export const signInWithGoogle = async ({ callbackURL }: { callbackURL: string }): Promise<boolean> => {
  try {
    const { authClient } = await import('@/lib/auth/auth-client')
    const { error } = await authClient.signIn.social({ provider: 'google', callbackURL })
    return !error
  } catch {
    return false
  }
}
