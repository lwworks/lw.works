import {FC} from 'react'
import {Icon, IconName} from '../icons'

export const IconBox: FC<{icon: IconName; color?: 'indigo' | 'rose' | 'emerald'}> = ({icon, color = 'indigo'}) => {
  const colors = {
    indigo: {bg: 'bg-indigo-400', text: 'text-indigo-400'},
    rose: {bg: 'bg-rose-400', text: 'text-rose-400'},
    emerald: {bg: 'bg-emerald-400', text: 'text-emerald-400'}
  }

  return (
    <div className="relative group w-14 h-14">
      <div className={`absolute inset-x-5 h-2 bottom-0 ${colors[color].bg} blur-md opacity-50`} />
      <div className="relative overflow-hidden h-14 w-14 rounded-2xl p-px bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-[#171C23] shadow-lg shadow-black/5">
        <div className={`absolute inset-x-4 h-4 -bottom-2 ${colors[color].bg} blur-md dark:opacity-80`} />
        <div className="relative h-full w-full rounded-[15px] bg-gradient-radial from-white to-slate-100 dark:from-[#393C45] dark:to-[#171C23] flex justify-center items-center">
          <div className={`absolute inset-x-4 h-4 -bottom-2 ${colors[color].bg} blur-lg dark:opacity-80`} />
          <Icon name={icon} className={`h-7 ${colors[color].text} transition-transform`} />
        </div>
      </div>
    </div>
  )
}
