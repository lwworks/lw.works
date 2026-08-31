import {google} from 'googleapis'

export const getCalendarClient = (calendarId: string) => {
  const isUserCalendar = !calendarId.includes('calendar.google.com')

  return google.calendar({
    version: 'v3',
    auth: new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
      subject: isUserCalendar ? calendarId : undefined
    })
  })
}
