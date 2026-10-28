const LW_OS_PREVIEW_HOSTS = [
  // Branch alias: lw-os-git-<branch>-lw-works.vercel.app
  /^lw-os-git-[a-z0-9-]+-lw-works\.vercel\.app$/,
  // Deployment URL with Vercel's 9-character hash; Vercel shortens lw-os to lw: lw-<hash>-lw-works.vercel.app
  /^lw-(os-)?[a-z0-9]{9}-lw-works\.vercel\.app$/,
]

/**
 * Origins of the current Vercel preview deployment (branch alias first, then the deployment URL).
 * Empty outside previews; only hosts shaped like an lw-os branch alias or a 9-character-hash deployment URL of
 * team lw-works are kept (project aliases such as `lw-website-lw-works.vercel.app` are ignored).
 */
export const getPreviewOrigins = (env: Record<string, string | undefined> = process.env): string[] => {
  if (env.VERCEL_ENV !== 'preview') return []
  return [env.VERCEL_BRANCH_URL, env.VERCEL_URL]
    .filter((host): host is string => !!host && LW_OS_PREVIEW_HOSTS.some((pattern) => pattern.test(host)))
    .map((host) => `https://${host}`)
}
