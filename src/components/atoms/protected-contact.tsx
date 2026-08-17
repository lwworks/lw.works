import { ProtectedContactClient } from '@/components/atoms/protected-contact-client'

// Reverse + base64 so the plaintext never appears in the HTML or RSC payload.
const encode = (value: string) => Buffer.from([...value].reverse().join(''), 'utf8').toString('base64')

// Same-length placeholder to avoid layout shift before hydration.
const mask = (value: string) => value.replace(/[a-zA-Z0-9]/g, '•')

type ProtectedContactProps = {
  className?: string
  /** Render the decoded value as plain text (span) instead of a link. */
  asText?: boolean
  /** Custom link content. Defaults to the decoded value. Must not contain the plaintext itself. */
  children?: React.ReactNode
}

export const ProtectedEmail = ({ email, ...props }: { email: string } & ProtectedContactProps) => (
  <ProtectedContactClient kind="email" encoded={encode(email)} placeholder={mask(email)} {...props} />
)

export const ProtectedPhone = ({ phone, ...props }: { phone: string } & ProtectedContactProps) => (
  <ProtectedContactClient kind="phone" encoded={encode(phone)} placeholder={mask(phone)} {...props} />
)
