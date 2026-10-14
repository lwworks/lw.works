import {getCalendarClient} from '.'

export const getEvents = async (calendarId: string) => {
  const calendar = getCalendarClient(calendarId)
  const response = await calendar.events.list({calendarId})
  return response.data.items ?? []
}
