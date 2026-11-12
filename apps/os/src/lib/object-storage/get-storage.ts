import 'server-only'

import { S3Client } from '@aws-sdk/client-s3'

export type Storage = { client: S3Client; bucket: string }

/** The bucket declared in `neon.ts`. */
const defaultBucket = 'uploads'

let cached: Storage | null | undefined

/**
 * The S3-compatible bucket (Neon Object Storage) for uploaded files, or null when it isn't configured.
 *
 * Reads `OBJECT_STORAGE_*` first (set these on Vercel, which reserves the `AWS_*` names), then the `AWS_*` names that
 * `neon deploy` / `neon env pull` write into `.env.local` — so local dev works without renaming anything.
 */
export const getStorage = (): Storage | null => {
  if (cached !== undefined) return cached
  const env = process.env
  const endpoint = env.OBJECT_STORAGE_ENDPOINT || env.AWS_ENDPOINT_URL_S3
  const region = env.OBJECT_STORAGE_REGION || env.AWS_REGION
  const accessKeyId = env.OBJECT_STORAGE_ACCESS_KEY_ID || env.AWS_ACCESS_KEY_ID
  const secretAccessKey = env.OBJECT_STORAGE_SECRET_ACCESS_KEY || env.AWS_SECRET_ACCESS_KEY
  const bucket = env.OBJECT_STORAGE_BUCKET || defaultBucket
  cached =
    endpoint && region && accessKeyId && secretAccessKey
      ? {
          // Neon Object Storage only supports path-style addressing.
          client: new S3Client({ endpoint, region, credentials: { accessKeyId, secretAccessKey }, forcePathStyle: true }),
          bucket,
        }
      : null
  return cached
}
