import 'server-only'

import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import type { Storage } from '@/lib/object-storage/get-storage'

/** Best effort: a leftover object only costs storage, so a failure is logged and not thrown. */
export const deleteObject = async (storage: Storage, key: string) => {
  try {
    await storage.client.send(new DeleteObjectCommand({ Bucket: storage.bucket, Key: key }))
  } catch (error) {
    console.error('Object delete failed:', key, error instanceof Error ? error.name : 'unknown error')
  }
}
