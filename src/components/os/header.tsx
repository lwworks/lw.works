import { ThemeSwitcher } from '@/components/atoms/theme-switcher'
import { SignOutButton } from '@/components/os/atoms/sign-out-button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { LogoOS } from '../atoms/logo-os'

const themeSwitcherContent = {
  light: 'Hell',
  dark: 'Dunkel',
  system: 'System',
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export const Header = ({
  userName,
  userImage,
}: {
  userName?: string | null
  userImage?: string | null
}) => {
  return (
    <header className="border-b border-black/10 dark:border-white/10 h-16 fixed top-0 w-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-lg z-50 px-4 lg:px-0">
      <div className="relative mx-auto w-full max-w-4xl px-4 sm:px-8 lg:px-16 h-full flex items-center justify-between border-x border-black/10 dark:border-white/10">
        <Link href="/os">
          <LogoOS className="text-black dark:text-white h-5" />
        </Link>
        <nav className="text-sm flex items-center gap-6">
          {userName ? (
            <div className="flex items-center gap-2">
              <Avatar size="sm">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    referrerPolicy="no-referrer"
                    className="aspect-square size-full rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                )}
              </Avatar>
              <span className="hidden sm:block truncate max-w-40">
                {userName}
              </span>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            {userName ? <SignOutButton /> : null}
            <ThemeSwitcher content={themeSwitcherContent} />
          </div>
        </nav>
      </div>
    </header>
  )
}
