import { Header } from '@/components/os/header'
import { getSession } from '@/lib/os/auth'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'OS',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function OsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <>
      <Header
        userName={session?.user.name}
        userImage={session?.user.image}
      />
      {children}
    </>
  )
}
