import { ThemeSwitcher } from '@lw/ui/atoms/theme-switcher'
import { SignOutButton } from '@/components/atoms/sign-out-button'
import { Avatar, AvatarFallback, AvatarImage } from '@lw/ui/components/avatar'
import Link from 'next/link'
import { LogoOS } from '@lw/ui/atoms/logo-os'
import type { getSession } from '@/lib/auth/get-session'
import { Suspense } from 'react'

const themeSwitcherContent = {
  light: 'Hell',
  dark: 'Dunkel',
  system: 'System',
}

type Session = Awaited<ReturnType<typeof getSession>>

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

const UserInfo = async ({ session }: { session: Promise<Session> }) => {
  const user = (await session)?.user
  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        {user.image ? (
          <AvatarImage src={user.image} alt={user.name} referrerPolicy="no-referrer" />
        ) : null}
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>
      <span className="hidden sm:block truncate max-w-40">
        {user.name}
      </span>
    </div>
  )
}

const UserSignOut = async ({ session }: { session: Promise<Session> }) => ((await session) ? <SignOutButton /> : null)

/** `session` streams in, so the session lookup doesn't hold back the rest of the page. */
export const Header = ({ session }: { session: Promise<Session> }) => {
  return (
    <header className="border-b border-black/10 dark:border-white/10 h-16 fixed top-0 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg z-50 px-4 lg:px-0">
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16 h-full flex items-center justify-between border-x border-black/10 dark:border-white/10">
        <Link href="/">
          <LogoOS className="text-black dark:text-white h-5" />
        </Link>
        <nav className="text-sm flex items-center gap-6">
          <Suspense fallback={null}>
            <UserInfo session={session} />
          </Suspense>
          <div className="flex items-center gap-2">
            <Suspense fallback={null}>
              <UserSignOut session={session} />
            </Suspense>
            <ThemeSwitcher content={themeSwitcherContent} />
          </div>
        </nav>
      </div>
    </header>
  )
}
