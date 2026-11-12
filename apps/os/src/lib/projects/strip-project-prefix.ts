import { parseProjectKey } from '@/lib/projects/parse-project-key'

/** The title without its `KEY:` prefix when that prefix is the entry's project key; otherwise unchanged. */
export const stripProjectPrefix = (title: string, projectKey: string | null | undefined) => {
  const parsed = parseProjectKey(title)
  return parsed && parsed.key === projectKey && parsed.rest ? parsed.rest : title
}
