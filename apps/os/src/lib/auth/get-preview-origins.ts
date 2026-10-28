// Vercel shortens lw-os deployment URLs to `lw-<hash>-lw-works`; branch aliases keep `lw-os-git-<branch>-lw-works`.
const LW_OS_PREVIEW_HOST = /^lw-(os-git-[a-z0-9-]+|(os-)?[a-z0-9]+)-lw-works\.vercel\.app$/

/**
 * Origins of the current Vercel preview deployment (branch alias first, then the deployment URL).
 * Empty outside previews; hosts that aren't an lw-os deployment of team lw-works are ignored.
 */
export const getPreviewOrigins = (env: Record<string, string | undefined> = process.env): string[] => {
  if (env.VERCEL_ENV !== 'preview') return []
  return [env.VERCEL_BRANCH_URL, env.VERCEL_URL]
    .filter((host): host is string => !!host && LW_OS_PREVIEW_HOST.test(host))
    .map((host) => `https://${host}`)
}
