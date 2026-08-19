import {getCalendarClient} from '.'

export const checkSlotAvailability = async (calendarId: string, startTime: string, endTime: string, timezone: string): Promise<boolean> => {
  const calendar = getCalendarClient(calendarId)
  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startTime,
      timeMax: endTime,
      timeZone: timezone,
      items: [{id: calendarId}]
    }
  })
  const busy = response.data.calendars?.[calendarId]?.busy ?? []
  return busy.length === 0
}
