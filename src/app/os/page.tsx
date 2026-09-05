import { getSession } from '@/lib/os/auth'
import { redirect } from 'next/navigation'

export default async function OsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/os/login')
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-8 lg:px-16">
      <p className="text-sm text-muted-foreground">LW Works OS</p>
    </div>
  )
}
