'use client'
import {FC, FormEvent, useState} from 'react'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import {ArrowIcon} from '@/components/icons/arrow'
import {format} from 'date-fns'
import {Button} from '@/components/atoms/button'
import {TextArea} from '@/components/atoms/textarea'
import {Checkbox} from '@/components/atoms/checkbox'
import {findFirstSlot} from '@/utils/dates/find-first-slot'
import * as Tooltip from '@radix-ui/react-tooltip'
import {Input} from '@/components/atoms/input'

export const BookingForm: FC<{weeks: CalendarWeek[]; id: string}> = ({weeks, id}) => {
  const firstSlot = findFirstSlot(weeks)
  const initialFormData = {
    name: '',
    email: '',
    comment: '',
    consent: false
  }
  const [week, setWeek] = useState<number>(firstSlot.week)
  const [day, setDay] = useState<string>(firstSlot.day.toString())
  const [slot, setSlot] = useState<string>('')
  const [formData, setFormData] = useState<{name: string; email: string; comment: string; consent: boolean}>(initialFormData)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const selectWeek = (direction: number) => {
    const newWeek = week + direction
    setWeek(newWeek)
    if (weeks[newWeek].days.filter((day) => day.slots.length > 0).length > 0) {
      setDay(weeks[newWeek].days.findIndex((day) => day.slots.length > 0).toString())
    } else {
      setDay('')
    }
  }

  const submitForm = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (day === '') throw {message: 'Bitte wähle einen Tag aus.'}
      if (slot === '') throw {message: 'Bitte wähle eine Uhrzeit aus.'}
      setLoading(true)
      setError('')
      const selectedSlot = weeks[week].days[Number(day)].slots[Number(slot)]
      console.log(selectedSlot)
      const response = await fetch('/api/book-call', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          shareId: id,
          name: formData.name,
          email: formData.email,
          comment: formData.comment,
          startAt: selectedSlot.startAt,
          endAt: selectedSlot.endAt
        })
      })
      const data = await response.json()
      console.log(data)
    } catch (error) {
      //@ts-ignore
      setError(error?.message || 'Leider ist bei der Anfrage ein Fehler aufgetreten.')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-black dark:text-white">
          {week !== undefined && day !== undefined
            ? `${weeks[week].days[Number(day)].dayOfMonth}. ${weeks[week].days[Number(day)].month} ${weeks[week].days[Number(day)].year}`
            : 'Tag auswählen'}
        </h2>
        <div className="flex items-center space-x-4">
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${week === 0 ? 'opacity-50' : 'hover:bg-slate-800/5 dark:hover:bg-white/10'}`}
            aria-label="Vorige Kalenderwoche"
            disabled={week === 0}
            onClick={() => selectWeek(-1)}
          >
            <ArrowIcon className="w-4 rotate-180 text-indigo-500 dark:text-indigo-400" />
          </button>
          <h3 className="font-mono uppercase">KW {weeks[week].week}</h3>
          <button
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              week === weeks.length - 1 ? 'opacity-50' : 'hover:bg-slate-800/5 dark:hover:bg-white/10'
            }`}
            aria-label="Nächste Kalenderwoche"
            disabled={week === weeks.length - 1}
            onClick={() => selectWeek(1)}
          >
            <ArrowIcon className="w-4 text-indigo-500 dark:text-indigo-400" />
          </button>
        </div>
      </div>
      <ToggleGroup.Root
        type="single"
        className="grid grid-cols-7 gap-1 sm:gap-2"
        value={day}
        onValueChange={(value) => {
          if (value) {
            console.log(value)
            setDay(value)
            setSlot('')
          }
        }}
      >
        {weeks[week].days.map(({dayOfMonth, month, year, weekday, slots}, index) => (
          <ToggleGroup.Item
            key={index}
            value={index.toString()}
            aria-label={`${dayOfMonth}. ${month} ${year}`}
            className={`h-16 rounded-2xl border border-slate-500 bg-slate-800/5 text-slate-600 focus:bg-white/20 focus:outline-none data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:focus:bg-black dark:border-slate-400 dark:bg-white/10 dark:text-slate-300 dark:data-[state=on]:border-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black dark:data-[state=on]:focus:bg-white ${
              slots.length > 0 ? 'hover:bg-slate-300/5 dark:hover:bg-white/20' : 'opacity-50'
            }`}
            disabled={slots.length === 0}
          >
            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="flex h-full w-full flex-col items-center justify-center">
                    <span className="text-sm opacity-75">{weekday}</span>
                    <span className="font-mono text-xl sm:text-2xl">{dayOfMonth}</span>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="bottom"
                    sideOffset={5}
                    className="rounded-md bg-black px-2 py-1.5 text-sm leading-none text-white shadow-md dark:bg-white dark:text-black"
                  >
                    <span>{`${slots.length} ${slots.length === 1 ? 'freier Slot' : 'freie Slots'}`}</span>
                    <Tooltip.Arrow className="fill-current text-black dark:text-white" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </ToggleGroup.Item>
        ))}
      </ToggleGroup.Root>
      <form className="mt-16 flex flex-col items-end space-y-4" onSubmit={submitForm}>
        <div className="flex w-full flex-col gap-16 sm:flex-row">
          <ul className="relative text-slate-400 dark:text-slate-500 sm:mt-2.5 sm:w-56 sm:shrink-0">
            {[...new Array(6)].map((element, index) => (
              <li key={index} className={`flex ${index === 5 ? '' : 'h-12'}`}>
                <div className="-mt-1.5 w-12 shrink-0 whitespace-nowrap font-mono text-xs leading-none">{13 + index}:00</div>
                <div className="grow border-t border-slate-200 dark:border-slate-800" />
              </li>
            ))}
            <ToggleGroup.Root type="single" value={slot} orientation="vertical" onValueChange={(value) => setSlot(value)}>
              {week !== undefined && day !== undefined
                ? weeks[week].days[Number(day)].slots.map(({startAt, endAt}, index) => {
                    return (
                      <ToggleGroup.Item
                        key={index}
                        value={index.toString()}
                        aria-label={`${format(startAt, 'HH:mm')} - ${format(endAt, 'HH:mm')}`}
                        className="absolute left-16 space-x-1 whitespace-nowrap rounded-full border border-slate-500 bg-slate-800/5 px-2.5 text-left font-mono text-sm uppercase text-slate-600 backdrop-blur-sm hover:bg-slate-300/5 focus:bg-white/20 focus:outline-none data-[state=on]:border-black data-[state=on]:bg-black data-[state=on]:text-white data-[state=on]:focus:bg-black dark:border-slate-400 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20 dark:data-[state=on]:border-white dark:data-[state=on]:bg-white dark:data-[state=on]:text-black dark:data-[state=on]:focus:bg-white"
                        style={{...getTimeslotStyle(startAt, endAt)}}
                      >{`${format(startAt, 'HH:mm')} - ${format(endAt, 'HH:mm')}`}</ToggleGroup.Item>
                    )
                  })
                : ''}
            </ToggleGroup.Root>
          </ul>
          <div className="flex grow flex-col items-start justify-end space-y-4">
            <Input
              id="name"
              label="Name"
              placeholder="Dein Name"
              type="string"
              required={true}
              data={formData}
              setData={setFormData}
              className="w-full"
              autocomplete="name"
            />
            <Input
              id="email"
              label="Email-Adresse"
              placeholder="Deine Email-Adresse"
              type="email"
              required={true}
              data={formData}
              setData={setFormData}
              className="w-full"
              autocomplete="email"
            />
            <TextArea
              id="comment"
              label="Worum geht es?"
              placeholder="Worum geht es?"
              data={formData}
              setData={setFormData}
              className="max-h-64 min-h-[6rem] w-full grow"
            />
            <div className="relative">
              <Checkbox
                id="consent"
                label={
                  <>
                    Ich habe die{' '}
                    <a className="text-indigo-500 dark:text-indigo-400" target="_blank" rel="noreferrer" href="https://lukaswiesehan.de/privacy">
                      Datenschutzerklärung
                    </a>{' '}
                    gelesen und bin mit der entsprechenden Datenverarbeitung einverstanden.
                  </>
                }
                data={formData}
                setData={setFormData}
                required
              />
            </div>
          </div>
        </div>
        <Button submit loading={loading} hideArrow>
          <div className="flex items-center space-x-2">
            <span>Gespräch vereinbaren</span>
          </div>
        </Button>
        {error && <p className="text-sm text-rose-500 dark:text-rose-400">{error}</p>}
      </form>
    </div>
  )
}

const getTimeslotStyle = (start: Date, end: Date) => {
  const startQuarters = start.getHours() * 4 + start.getMinutes() / 15 - 52
  const endQuarters = end.getHours() * 4 + end.getMinutes() / 15 - 52
  return {
    top: `${startQuarters * 0.75}rem`,
    height: `${(endQuarters - startQuarters) * 0.75}rem`
  }
}
