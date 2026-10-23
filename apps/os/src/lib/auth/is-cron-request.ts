import { safeEqual } from '@/lib/crypto/safe-equal'

/** Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`; without a configured secret nothing is authorized. */
export const isCronRequest = (request: Request) => {
  const secret = process.env.CRON_SECRET
  return Boolean(secret) && safeEqual(request.headers.get('Authorization') ?? '', `Bearer ${secret}`)
}
