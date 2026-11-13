"use client"

import { formatDateKey } from "@/lib/format/format-date-key"
import { parseDateKey } from "@/lib/format/parse-date-key"
import { Button } from "@lw/ui/components/button"
import { Calendar } from "@lw/ui/components/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { cn } from "@lw/ui/lib/utils"
import { Calendar as CalendarIcon, X } from "@mynaui/icons-react"
import { useState } from "react"
import type { Matcher } from "react-day-picker"
import { de } from "react-day-picker/locale"

const formatLong = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format

/**
 * shadcn date picker for a single day. Submits `YYYY-MM-DD` (or empty) as a hidden `name` input.
 * Works uncontrolled (`defaultValue`) or controlled (`value` + `onValueChange`).
 */
export const DatePicker = ({
  id,
  name,
  defaultValue = null,
  value: controlledValue,
  onValueChange,
  placeholder = "Datum wählen",
  disabled,
  clearable = true,
}: {
  id?: string
  name: string
  defaultValue?: string | null
  value?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  /** Days that cannot be picked, e.g. `{ before: start }`. */
  disabled?: Matcher | Matcher[]
  clearable?: boolean
}) => {
  const [open, setOpen] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
  const value = controlledValue === undefined ? uncontrolledValue : controlledValue
  const date = parseDateKey(value)

  const change = (next: string | null) => {
    if (controlledValue === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  return (
    <>
      <input type="hidden" name={name} value={date ? formatDateKey(date) : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("relative")}>
          <PopoverTrigger asChild>
            <Button id={id} type="button" variant="outline" className={cn("w-full justify-start font-normal", clearable && date && "pr-8", !date && "text-muted-foreground")}>
              <CalendarIcon strokeWidth={1.5} className={cn("size-4")} />
              <span className={cn("truncate")}>{date ? formatLong(date) : placeholder}</span>
            </Button>
          </PopoverTrigger>
          {clearable && date ? (
            <button
              type="button"
              aria-label="Datum entfernen"
              onClick={() => change(null)}
              className={cn("absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white")}
            >
              <X strokeWidth={1.5} className={cn("size-3.5")} />
            </button>
          ) : null}
        </div>
        <PopoverContent align="start" className={cn("w-auto p-0")}>
          <Calendar
            mode="single"
            locale={de}
            captionLayout="dropdown"
            selected={date}
            defaultMonth={date}
            disabled={disabled}
            onSelect={(next) => {
              change(next ? formatDateKey(next) : null)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  )
}
