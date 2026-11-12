import 'server-only'

import { PutObjectCommand } from '@aws-sdk/client-s3'
import type { Storage } from '@/lib/object-storage/get-storage'

export const putObject = async (storage: Storage, key: string, body: Uint8Array, contentType: string) => {
  await storage.client.send(new PutObjectCommand({ Bucket: storage.bucket, Key: key, Body: body, ContentType: contentType }))
}
