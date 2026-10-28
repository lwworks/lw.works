import { getPreviewOrigins } from '@/lib/auth/get-preview-origins'

/**
 * Whether this deployment sends Google sign-in through production's OAuth proxy: Vercel previews without their own
 * BETTER_AUTH_URL (a preview with one handles its Google callback itself and needs its redirect URI registered).
 */
export const proxiesThroughProduction = (env: Record<string, string | undefined> = process.env): boolean =>
  getPreviewOrigins(env).length > 0 && !env.BETTER_AUTH_URL
