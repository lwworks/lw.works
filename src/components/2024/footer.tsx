import {Logo} from '@/components/visuals/logo'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="relative py-8 px-4 sm:py-16 lg:py-24 max-w-2xl mx-auto flex justify-between items-center">
      <Link href="/">
        <Logo className="h-6 text-black dark:text-white" />
      </Link>
    </footer>
  )
}
