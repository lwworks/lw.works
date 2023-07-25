import Link from 'next/link'

const menus = [
  {
    title: 'Seiten',
    elements: [
      {caption: 'Home', href: 'https://lukaswiesehan.de/'},
      {caption: 'Blog', href: '/blog'},
      {caption: 'Work', href: 'https://lukaswiesehan.de/work'}
    ]
  },
  {
    title: 'Rechtliches',
    elements: [
      {caption: 'Kontakt', href: 'https://lukaswiesehan.de/contact'},
      {caption: 'Impressum', href: 'https://lukaswiesehan.de/legal'},
      {caption: 'Datenschutz', href: 'https://lukaswiesehan.de/privacy'}
    ]
  }
]

export const Footer = () => {
  return (
    <section className="pt-3">
      <div className="relative z-10 mx-auto -mb-4 w-full max-w-screen-xl px-6 sm:px-8 lg:px-12">
        <div className="absolute h-8 w-14 bg-white blur-lg dark:bg-[#0E1117] dark:blur-md" style={{borderRadius: '50% 50%'}} />
        <svg
          className="relative h-8 fill-current stroke-slate-300/80 text-[#F9FAFB] dark:stroke-slate-700 dark:text-[#15191F]"
          viewBox="0 0 55 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.31257 3.02283C6.66833 1.39396 8.30831 0.0734863 9.97559 0.0734863H16.617L11.7216 22.4886H24.4009L22.3396 31.9265H0L6.31257 3.02283Z"
            fill="current"
            stroke="current"
          />
          <path
            d="M31.6709 3.02283H41.3312L35.6629 28.977C35.3071 30.606 33.6671 31.9265 31.9998 31.9265H25.3582L31.6709 3.02283Z"
            fill="current"
            stroke="current"
          />
          <path
            d="M54.6546 0.0734863H44.9942L38.6817 28.977H45.3232C46.9904 28.977 48.6304 27.6566 48.9862 26.0278L54.6546 0.0734863Z"
            fill="current"
            stroke="current"
          />
          <path d="M19.6357 0.0734863H29.2961L25.0447 19.5391H15.3844L19.6357 0.0734863Z" fill="current" stroke="current" />
        </svg>
      </div>
      <div className="relative border-t border-slate-200 pb-12 dark:border-slate-700 sm:pb-16 md:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="mx-auto -mt-48 h-96 w-full max-w-screen-xl bg-[#F9FAFB] blur-3xl dark:bg-[#15191F] sm:blur-4xl"
            style={{borderRadius: '50% 50%'}}
          />
        </div>
        <div className="relative mx-auto mt-12 flex w-full max-w-screen-xl flex-col justify-between px-6 text-sm text-slate-400 dark:text-slate-500 sm:-mt-8 sm:flex-row sm:space-y-0 sm:px-8 lg:px-12">
          <div className="order-2 mt-12 sm:order-1 sm:mt-16">
            <p className="font-mono text-xs uppercase">&copy; Lukas Wiesehan 2023</p>
          </div>
          <div className="order-1 flex space-x-8 sm:order-2 sm:space-x-16">
            {menus.map(({title, elements}, index) => (
              <div key={index}>
                <h4 className="mb-6 text-xs font-bold uppercase tracking-wider text-indigo-500/70 dark:text-indigo-400/70 sm:mb-12">{title}</h4>
                <ul className="space-y-2">
                  {elements.map(({caption, href}, index) => (
                    <li key={index}>
                      <Link href={href} className="hover:text-slate-500 dark:hover:text-slate-400">
                        {caption}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
