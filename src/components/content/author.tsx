import {InstagramIcon} from '@/components/icons/instagram'
import {LinkedinIcon} from '@/components/icons/linkedin'
import {TwitterIcon} from '@/components/icons/twitter'
import Image from 'next/image'
import Link from 'next/link'
import {FC} from 'react'

export const Author: FC<{name: string; description: string; avatar: string; linkedin?: string; instagram?: string; twitter?: string}> = ({
  name,
  description,
  avatar,
  linkedin,
  instagram,
  twitter
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-black dark:border-white">
        <Image src={avatar} alt={name} fill placeholder="blur" blurDataURL={avatar} />
      </div>
      <div>
        <p className="pt-1 font-semibold leading-none text-black dark:text-white">{name}</p>
        <p className="leading-snug text-slate-600 dark:text-slate-300">{description}</p>
        <p className="pt-1 text-black dark:text-white">
          {linkedin && (
            <Link href={linkedin} className="mr-2 inline-block hover:text-slate-700 dark:hover:text-slate-300" rel="noreferrer" target="_blank">
              <LinkedinIcon className="h-4" />
            </Link>
          )}
          {instagram && (
            <Link href={instagram} className="mr-2 inline-block hover:text-slate-700 dark:hover:text-slate-300" rel="noreferrer" target="_blank">
              <InstagramIcon className="h-4" />
            </Link>
          )}
          {twitter && (
            <Link href={twitter} className="mr-2 inline-block hover:text-slate-700 dark:hover:text-slate-300" rel="noreferrer" target="_blank">
              <TwitterIcon className="h-4" />
            </Link>
          )}
        </p>
      </div>
    </div>
  )
}
