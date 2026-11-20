import { createHmac, timingSafeEqual } from 'node:crypto'

export function verifySignature(body: Buffer, signature: string | null, secret: string) {
  if (!signature || !/^[a-f\d]{64}$/i.test(signature)) return false

  const expected = createHmac('sha256', secret).update(body).digest()
  return timingSafeEqual(expected, Buffer.from(signature, 'hex'))
}
