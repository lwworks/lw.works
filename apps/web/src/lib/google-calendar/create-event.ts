import {getCalendarClient} from '.'

export const createEvent = async (calendarId: string, event: CalendarEvent) => {
  const calendar = getCalendarClient(calendarId)
  const response = await calendar.events.insert({
    calendarId,
    requestBody: {
      id: event.id,
      summary: event.summary,
      start: event.start,
      end: event.end,
      description: event.description
    }
  })
  return {data: response.data}
}
