import {getCalendarClient} from '.'

export const updateEvent = async (calendarId: string, event: CalendarEvent) => {
  const calendar = getCalendarClient(calendarId)
  const response = await calendar.events.update({
    calendarId,
    eventId: event.id,
    requestBody: {
      summary: event.summary,
      start: event.start,
      end: event.end,
      description: event.description
    }
  })
  return {data: response.data}
}
