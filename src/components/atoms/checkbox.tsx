import {Dispatch, FC, ReactNode, SetStateAction} from 'react'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import {CheckSquareIcon} from '@/components/icons/check-square'

export const Checkbox: FC<{
  id: string
  label: ReactNode
  required?: boolean | false
  data: any
  setData: Dispatch<SetStateAction<any>>
  className?: string
}> = ({id, label, required, data, setData}) => {
  const handleChange = (checked: boolean) => {
    let currentData = {...data}
    currentData[id] = checked
    setData(currentData)
  }

  return (
    <div className="flex w-full space-x-2 text-sm">
      <RadixCheckbox.Root
        className="relative h-4 w-4 shrink-0 overflow-hidden rounded border border-black/10 bg-slate-200/20 focus:outline-none focus:ring-1 focus:ring-black/10 dark:border-white/20 dark:bg-slate-200/5 dark:focus:ring-white/30"
        defaultChecked
        id={id}
        checked={data[id]}
        onCheckedChange={handleChange}
        required={required}
      >
        <RadixCheckbox.Indicator className="absolute -inset-1">
          <CheckSquareIcon className="w-full text-indigo-500 dark:text-indigo-400" />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label className="-mt-0.5" htmlFor={id}>
        {label}
      </label>
    </div>
  )
}
