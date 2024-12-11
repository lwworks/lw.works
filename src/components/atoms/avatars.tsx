import Image from 'next/image'
import {FC} from 'react'

export const Avatars: FC<{avatars: {src: string; alt: string; blurHash: string}[]; plus?: number}> = ({avatars, plus}) => {
  return (
    <ul className="pl-3 flex">
      {avatars.map(({src, alt, blurHash}, index) => (
        <li
          key={index}
          className="w-9 h-9 rounded-full p-0.5 -ml-3 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 shadow-md"
        >
          <div className="w-full overflow-hidden rounded-full">
            <Image src={src} alt="Avatar" width="400" height="400" placeholder="blur" blurDataURL={blurHash} className="w-full" />
          </div>
        </li>
      ))}
      {plus && <li className="text-xs font-bold text-black dark:text-white leading-none mt-px">+{plus}</li>}
    </ul>
  )
}
