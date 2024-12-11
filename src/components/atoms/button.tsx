'use client'
import {motion} from 'framer-motion'
import {Loader} from '@/components/atoms/loader'
import {FC, ReactNode} from 'react'
import {useRouter} from 'next/navigation'

export const Button: FC<{
  secondary?: boolean | false
  submit?: boolean | false
  href?: string
  action?: () => void
  loading?: boolean | false
  disabled?: boolean | false
  hideArrow?: boolean | false
  children: ReactNode
}> = ({secondary, submit, href, loading, disabled, action, hideArrow, children}) => {
  const router = useRouter()
  const transitionDuration = 0.15
  const lineVariants = {
    rest: {opacity: 0, scaleX: 0, transition: {duration: transitionDuration}},
    hover: disabled ? {} : {opacity: 1, scaleX: 1, transition: {duration: transitionDuration}}
  }
  const chevronVariants = {
    rest: {x: -7, transition: {duration: transitionDuration}},
    hover: disabled ? {} : {x: 0, transition: {duration: transitionDuration}}
  }

  const disabledStyle =
    'relative cursor-not-allowed h-9 flex-shrink-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#393C45] dark:to-[#1A1D24] p-px shadow shadow-black/5'
  const primaryStyle =
    'relative h-9 flex-shrink-0 rounded-full bg-gradient-to-b from-indigo-400 to-indigo-500 p-px shadow shadow-indigo-500/25 focus:outline-none focus:ring-1 focus:ring-white/30'
  const secondaryStyle =
    'relative h-9 flex-shrink-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#393C45] dark:to-[#1A1D24] p-px shadow shadow-black/5 focus:outline-none focus:ring-1 focus:ring-white/20'

  return (
    <motion.button
      className={disabled ? disabledStyle : secondary ? secondaryStyle : primaryStyle}
      type={submit ? 'submit' : 'button'}
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={
        href
          ? () => {
              if (href.startsWith('#')) {
                console.log(href)
                document.getElementById(href.replace('#', ''))?.scrollIntoView({behavior: 'smooth'})
              } else {
                if (href.startsWith('https')) {
                  window.open(href, '_blank')
                } else {
                  router.push(href)
                }
              }
            }
          : action
          ? action
          : undefined
      }
      disabled={loading || disabled}
    >
      <div
        className={`flex h-full items-center justify-center space-x-2 rounded-full ${
          disabled
            ? 'bg-[#F9FAFB] text-black/50 dark:bg-[#171C23] dark:text-white/50'
            : secondary
            ? 'bg-[#F9FAFB] text-slate-800 hover:bg-white dark:bg-[#171C23] dark:text-slate-50 dark:hover:bg-[#1E242B]'
            : 'bg-indigo-500 text-indigo-50 hover:bg-[#7375EE]'
        } font-bold  ${hideArrow || disabled ? 'px-4' : 'pl-4 pr-2.5'}`}
      >
        <span className="dark:drop-shadow">{children}</span>
        {!hideArrow && !disabled && (
          <svg
            height="10"
            viewBox="0 0 20 10"
            className={`fill-current opacity-50 dark:drop-shadow ${secondary ? 'text-slate-600 dark:text-white' : 'text-white'}`}
            fill="current"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0.5 5C0.5 4.44772 0.947715 4 1.5 4L18.5 4C19.0523 4 19.5 4.44772 19.5 5C19.5 5.55229 19.0523 6 18.5 6L1.5 6C0.947715 6 0.5 5.55228 0.5 5Z"
              fill="current"
              variants={lineVariants}
            />
            <motion.path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.2071 0.292893C14.8166 -0.0976311 14.1834 -0.0976311 13.7929 0.292893C13.4024 0.683418 13.4024 1.31658 13.7929 1.70711L17.0858 5L13.793 8.29274C13.4025 8.68327 13.4025 9.31643 13.793 9.70696C14.1836 10.0975 14.8167 10.0975 15.2073 9.70696L19.2071 5.70711L19.2073 5.70696C19.5978 5.31643 19.5978 4.68327 19.2073 4.29274C19.2023 4.28781 19.1974 4.28294 19.1924 4.27814L15.2071 0.292893Z"
              fill="current"
              variants={chevronVariants}
            />
          </svg>
        )}
      </div>
      {loading && (
        <div
          className={`absolute inset-px flex items-center justify-center rounded-full ${
            secondary ? 'bg-[#F9FAFB] text-slate-800 dark:bg-[#171C23] dark:text-slate-50' : 'bg-indigo-500 text-indigo-50'
          }`}
        >
          <Loader />
        </div>
      )}
    </motion.button>
  )
}
