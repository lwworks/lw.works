import 'server-only'

import { z } from 'zod'

const required = z.string().trim().min(1)
const envSchema = z.object({
  LINEAR_WEBHOOK_SECRET: required,
  LINEAR_CLIENT_ID: required,
  LINEAR_CLIENT_SECRET: required,
  ROUTINE_WEBHOOK_URL: z.url({ protocol: /^https$/ }),
  ROUTINE_WEBHOOK_KEY: required,
  ALLOWED_EMAILS: z.string()
    .transform((value) => value.split(',').map((email) => email.trim().toLowerCase()).filter(Boolean))
    .pipe(z.array(z.email()).min(1)),
  LINEAR_SCOPES: required.default('read,write,app:mentionable,app:assignable'),
})

export type RelayConfig = z.output<typeof envSchema>

export function getRelayConfig() {
  const result = envSchema.safeParse(process.env)
  if (result.success) return result.data

  console.error('Linear agent relay: invalid environment variables', result.error.issues.map(({ path }) => path.join('.')))
  return null
}
