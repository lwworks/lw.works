import {FC, ReactNode} from 'react'

export const Card: FC<{children: ReactNode}> = ({children}) => {
  return (
    <div className="relative overflow-hidden w-full p-px rounded-[2.5rem] bg-gradient-to-b from-slate-100 to-slate-200 dark:from-[#393C45] dark:to-[#1A1D24]">
      <div className="absolute w-1/2 h-32 -right-8 dark:right-auto dark:-left-8 -top-16 bg-black/40 dark:bg-white blur-3xl opacity-25" />
      <div className="relative w-full rounded-[39px] p-14 bg-[#F9FAFB] dark:bg-[#101318]">{children}</div>
    </div>
  )
}
