import { Link } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'
import { useLocale, useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { Logo } from './logo'

export const Navigation = () => {
  const t = useTranslations('navigation')
  const locale = useLocale() as Locale
  const otherLocale = locale === 'de' ? 'en' : 'de'

  const items = [
    { label: t('home'), href: '/' as const },
    { label: t('services'), href: '/leistungen' as const },
    { label: t('blog'), href: '/blog' as const },
  ]

  return (
    <nav className="flex items-center justify-between h-20">
      <Link href="/">
        <Logo className="text-black dark:text-white h-6" />
      </Link>
      <ul className="flex items-center gap-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
        <li>
          <Button asChild>
            <Link href="/">{t('cta')}</Link>
          </Button>
        </li>
        <li>
          <Link href="/" locale={otherLocale} className="text-sm font-medium uppercase">
            {otherLocale.toUpperCase()}
          </Link>
        </li>
      </ul>
    </nav>
  )
}
