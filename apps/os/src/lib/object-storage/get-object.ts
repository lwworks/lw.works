import 'server-only'

import { GetObjectCommand, NoSuchKey } from '@aws-sdk/client-s3'
import type { Storage } from '@/lib/object-storage/get-storage'

/** The object's bytes and content type, or null when the key doesn't exist. */
export const getObject = async (storage: Storage, key: string) => {
  try {
    const result = await storage.client.send(new GetObjectCommand({ Bucket: storage.bucket, Key: key }))
    if (!result.Body) return null
    return { body: await result.Body.transformToByteArray(), contentType: result.ContentType ?? 'application/octet-stream' }
  } catch (error) {
    if (error instanceof NoSuchKey) return null
    throw error
  }
}
