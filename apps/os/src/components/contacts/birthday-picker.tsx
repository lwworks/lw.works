"use client"

import { Button } from "@lw/ui/components/button"
import { Calendar } from "@lw/ui/components/calendar"
import { Checkbox } from "@lw/ui/components/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@lw/ui/components/popover"
import { cn } from "@lw/ui/lib/utils"
import { Gift, X } from "@mynaui/icons-react"
import { useState } from "react"
import { de } from "react-day-picker/locale"

type Birthday = { day: number; month: number; year?: number }

/** Leap year the calendar shows while the year is unknown, so 29 February can be picked. */
const YEARLESS = 2000
const FIRST_MONTH = new Date(1900, 0)

const formatWithYear = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric" }).format
const formatWithoutYear = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long" }).format

/**
 * shadcn date picker for a birthday whose year may be unknown (Google allows that).
 * Submits `birthdayDay`, `birthdayMonth` and `birthdayYear` (empty without a year) as hidden inputs.
 */
export const BirthdayPicker = ({ id, defaultValue }: { id?: string; defaultValue?: Birthday | null }) => {
  const [open, setOpen] = useState(false)
  const [birthday, setBirthday] = useState<Birthday | null>(defaultValue ?? null)
  const [withoutYear, setWithoutYear] = useState(Boolean(defaultValue && !defaultValue.year))
  const date = birthday ? new Date(birthday.year ?? YEARLESS, birthday.month - 1, birthday.day) : undefined

  const pick = (next: Date | undefined) => {
    if (!next) return setBirthday(null)
    setBirthday({ day: next.getDate(), month: next.getMonth() + 1, year: withoutYear ? undefined : next.getFullYear() })
    setOpen(false)
  }

  const toggleYear = (checked: boolean) => {
    setWithoutYear(checked)
    if (!birthday) return
    // Dropping the year keeps day and month; adding it back uses the year shown in the calendar.
    setBirthday({ day: birthday.day, month: birthday.month, year: checked ? undefined : (date?.getFullYear() ?? YEARLESS) })
  }

  return (
    <>
      <input type="hidden" name="birthdayDay" value={birthday?.day ?? ""} />
      <input type="hidden" name="birthdayMonth" value={birthday?.month ?? ""} />
      <input type="hidden" name="birthdayYear" value={birthday?.year ?? ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <div className={cn("relative")}>
          <PopoverTrigger asChild>
            <Button id={id} type="button" variant="outline" className={cn("w-full justify-start font-normal", birthday && "pr-8", !birthday && "text-muted-foreground")}>
              <Gift strokeWidth={1.5} className={cn("size-4")} />
              <span className={cn("truncate")}>
                {date ? (birthday?.year ? formatWithYear(date) : formatWithoutYear(date)) : "Geburtstag wählen"}
              </span>
            </Button>
          </PopoverTrigger>
          {birthday ? (
            <button
              type="button"
              aria-label="Geburtstag entfernen"
              onClick={() => setBirthday(null)}
              className={cn("absolute top-1/2 right-2 flex size-5 -translate-y-1/2 items-center justify-center rounded hover:bg-neutral-100 hover:text-black dark:hover:bg-neutral-800 dark:hover:text-white")}
            >
              <X strokeWidth={1.5} className={cn("size-3.5")} />
            </button>
          ) : null}
        </div>
        <PopoverContent align="start" className={cn("w-auto gap-0 p-0")}>
          <Calendar
            mode="single"
            locale={de}
            captionLayout={withoutYear ? "label" : "dropdown"}
            startMonth={withoutYear ? new Date(YEARLESS, 0) : FIRST_MONTH}
            endMonth={withoutYear ? new Date(YEARLESS, 11) : new Date()}
            selected={date}
            defaultMonth={date ?? (withoutYear ? new Date(YEARLESS, 0) : undefined)}
            formatters={withoutYear ? { formatCaption: (month) => month.toLocaleString("de-DE", { month: "long" }) } : undefined}
            onSelect={pick}
          />
          <label className={cn("flex items-center gap-2 border-t border-neutral-200 px-3 py-2.5 text-sm dark:border-neutral-800")}>
            <Checkbox checked={withoutYear} onCheckedChange={(checked) => toggleYear(checked === true)} />
            <span>Jahr unbekannt</span>
          </label>
        </PopoverContent>
      </Popover>
    </>
  )
}
