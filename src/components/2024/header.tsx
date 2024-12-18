import {LanguageButton} from '@/components/2024/atoms/language-button'
import {ThemeButton} from '@/components/2024/atoms/theme-button'
import {Logo} from '@/components/visuals/logo'
import {Locale} from '@/i18n.config'
import Link from 'next/link'
import {PrivacyButton} from './atoms/privacy-button'

export const Header = ({lang}: {lang: Locale}) => {
  return (
    <header className="relative py-8 px-4 sm:py-16 lg:py-24 max-w-2xl mx-auto flex justify-between items-center">
      <div className="flex items-center font-mono uppercase gap-2 text-black dark:text-white text-sm">
        <Link href="/">
          <Logo className="h-6" />
        </Link>
        <span className="text-rose-400">
          <span className="inline-block -rotate-6">/</span>
          <span className="inline-block -rotate-6 -ml-0.5">/</span>
          <span className="inline-block -rotate-6 -ml-0.5">/</span>
        </span>
        <span>Integrations</span>
      </div>
      <div className="shrink-0 flex items-center">
        <LanguageButton />
        <ThemeButton />
        <PrivacyButton lang={lang} />
      </div>
    </header>
  )
}
