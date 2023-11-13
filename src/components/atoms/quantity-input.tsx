import {FC, Dispatch, SetStateAction} from 'react'
import {Loader} from './loader'

export const QuantityInput: FC<{count: number; setCount: Dispatch<SetStateAction<number>>; loading?: boolean | false}> = ({count, setCount, loading}) => {
  return (
    <div>
      <label htmlFor="quantity" className="sr-only">
        Anzahl
      </label>
      <div className="relative h-9 shrink-0 rounded-full bg-gradient-to-b from-slate-100 to-slate-200 p-px font-mono shadow shadow-black/5 dark:from-[#393C45] dark:to-[#1A1D24]">
        <div className="flex space-x-px">
          <button
            aria-label="-1"
            className="flex h-[2.125rem] w-9 items-center justify-center rounded-l-full bg-[#F9FAFB] pl-0.5 pb-0.5 text-2xl leading-none text-slate-800/50 hover:bg-white dark:bg-[#171C23] dark:text-slate-50/50 dark:hover:bg-[#1E242B]"
            disabled={count <= 1}
            onClick={() => setCount((c) => c - 1)}
          >
            -
          </button>
          <div className="relative">
            <input
              id="quantity"
              name="quantity"
              type="number"
              value={count}
              className="h-[2.125rem] w-11 rounded-none bg-[#F9FAFB] text-center text-slate-800 dark:bg-[#171C23] dark:text-slate-50"
              aria-label="Anzahl"
              onChange={() => {}}
            />
            <div className="absolute inset-0 bg-transparent" />
          </div>
          <button
            aria-label="+1"
            className="flex h-[2.125rem] w-9 items-center justify-center rounded-r-full bg-[#F9FAFB] pb-0.5 pr-0.5 text-2xl leading-none text-slate-800/50 hover:bg-white dark:bg-[#171C23] dark:text-slate-50/50 dark:hover:bg-[#1E242B]"
            onClick={() => setCount((c) => c + 1)}
          >
            +
          </button>
        </div>
        {loading && (
          <div className="absolute inset-px flex items-center justify-center rounded-full bg-[#F9FAFB] text-slate-800 dark:bg-[#171C23] dark:text-slate-50">
            <Loader />
          </div>
        )}
      </div>
    </div>
  )
}
