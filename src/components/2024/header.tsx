import {Logo} from '@/components/visuals/logo'
import {ThemeButton} from '@/components/2024/atoms/theme-button'
import {LanguageButton} from '@/components/2024/atoms/language-button'
import Link from 'next/link'
import {PrivacyButton} from './atoms/privacy-button'
import {Locale} from '@/i18n.config'

export const Header = ({lang}: {lang: Locale}) => {
  return (
    <header className="relative py-8 px-4 sm:py-16 lg:py-24 max-w-2xl mx-auto flex justify-between items-center">
      <Link href="/">
        <Logo className="h-6 text-black dark:text-white" />
      </Link>
      <div className="shrink-0 flex items-center">
        <LanguageButton />
        <ThemeButton />
        <PrivacyButton lang={lang} />
      </div>
    </header>
  )
}
