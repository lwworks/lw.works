import {getCalendarClient} from '.'

export const getAvailabilityCalendarIds = (config: BookingConfig): string[] => {
  return [...new Set([config.calendarId, ...(config.availabilityCalendarIds ?? [])])]
}

type BusySlot = {start: string; end: string}

export const queryFreeBusy = async (config: BookingConfig, timeMin: string, timeMax: string): Promise<BusySlot[]> => {
  const calendar = getCalendarClient(config.calendarId)
  const calendarIds = getAvailabilityCalendarIds(config)
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin,
      timeMax,
      timeZone: config.timezone,
      items: calendarIds.map((id) => ({id}))
    }
  })

  const calendars = response.data.calendars ?? {}
  const failed = calendarIds.filter((id) => {
    const result = calendars[id]
    return !result || (result.errors && result.errors.length > 0)
  })
  if (failed.length > 0) {
    throw new Error(`Free/busy lookup failed for calendars: ${failed.join(', ')}`)
  }

  return calendarIds.flatMap((id) =>
    (calendars[id]?.busy ?? []).flatMap((slot) => (slot.start && slot.end ? [{start: slot.start, end: slot.end}] : []))
  )
}
