import { timingSafeEqual } from 'node:crypto'

/** Constant-time string comparison for secrets. */
export const safeEqual = (a: string, b: string) => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}
