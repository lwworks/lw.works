import {getDateSlug} from '@/utils/dates/get-date-slug'
import {getDatesForThreeWeeks} from '@/utils/dates/get-dates-for-three-weeks'
import {getDatesOfWeek} from '@/utils/dates/get-dates-of-week'
import {getDividedSlots} from '@/utils/dates/get-divided-slots'
import {getMonday} from '@/utils/dates/get-monday'
import {getWeek} from '@/utils/dates/get-week'
import {format} from 'date-fns'
import {de} from 'date-fns/locale'

export const getSlotsByWeek = (sharedCalendar: SharedCalendar): CalendarWeek[] => {
  const dates = getDatesForThreeWeeks()

  let slotsByDate: any = []
  for (const date of dates) {
    const slug = getDateSlug(date)
    slotsByDate.push({
      slug,
      week: getWeek(date),
      date: date,
      slots: sharedCalendar.slots
        .filter((slot) => getDateSlug(slot.startAt) === getDateSlug(date))
        .map((slot) => getDividedSlots(slot, sharedCalendar.eventMaxDurationMinutes))
        .flat()
    })
  }
  //@ts-ignore
  const weeks = [...new Set(slotsByDate.map((day: any) => day.week))].map((week) => {
    const monday = getMonday(slotsByDate.find((day: any) => day.week === week).date)
    return {
      week,
      days: getDatesOfWeek(monday).map((date: Date) => {
        const slug = getDateSlug(date)
        const slots = slotsByDate.find((day: any) => day.slug === slug)?.slots
        return {
          slug,
          date,
          dayOfMonth: date.getDate(),
          month: format(date, 'MMMM', {locale: de}),
          year: format(date, 'yyyy'),
          weekday: format(date, 'EE', {locale: de}),
          slots: slots || []
        }
      })
    }
  })
  return weeks
}
