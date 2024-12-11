import crypto from 'crypto'

export const emailHash = (email: string) => {
  return crypto.createHash('sha1').update(email).digest('hex')
}
