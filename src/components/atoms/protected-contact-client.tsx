'use client'

import { useEffect, useState } from 'react'

type ProtectedContactClientProps = {
  kind: 'email' | 'phone'
  encoded: string
  placeholder: string
  className?: string
  asText?: boolean
  children?: React.ReactNode
}

const decode = (encoded: string) => [...atob(encoded)].reverse().join('')

export const ProtectedContactClient = ({ kind, encoded, placeholder, className, asText, children }: ProtectedContactClientProps) => {
  const [value, setValue] = useState<string | null>(null)

  useEffect(() => {
    setValue(decode(encoded))
  }, [encoded])

  if (asText) {
    return <span className={className}>{value ?? placeholder}</span>
  }

  if (!value) {
    return <span className={className}>{children ?? placeholder}</span>
  }

  const href = kind === 'email' ? `mailto:${value}` : `tel:${value.replace(/[^+\d]/g, '')}`

  return (
    <a href={href} className={className}>
      {children ?? value}
    </a>
  )
}
