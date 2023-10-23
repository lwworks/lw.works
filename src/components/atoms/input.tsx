import {ChangeEvent, ChangeEventHandler, Dispatch, FC, SetStateAction} from 'react'

export const Input: FC<{
  id: string
  label: string
  placeholder: string
  type: string
  required?: boolean | false
  data: any
  setData: Dispatch<SetStateAction<any>>
  autocomplete?: string
  className?: string
}> = ({id, label, placeholder, type, data, setData, required, autocomplete, className}) => {
  const handleChange: ChangeEventHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let currentData = {...data}
    currentData[id] = e.target.value
    setData(currentData)
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {label}
        {required && <span className="font-black text-indigo-400"> *</span>}
      </label>
      <input
        name={id}
        id={id}
        type={type}
        autoComplete={autocomplete}
        placeholder={placeholder}
        value={data[id]}
        onChange={handleChange}
        required={required}
        className="h-9 w-full rounded-lg border border-black/10 bg-slate-200/20 px-4 py-2 text-black placeholder-black/60 backdrop-blur-xl focus:outline-none focus:ring-1 focus:ring-black/10 dark:border-white/20 dark:bg-slate-200/5 dark:text-white dark:placeholder-white/60 dark:focus:ring-white/30"
      />
    </div>
  )
}
