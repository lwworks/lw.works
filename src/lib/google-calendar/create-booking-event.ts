import {tz} from '@date-fns/tz'
import {addMinutes} from 'date-fns'
import {getCalendarClient} from '.'
import {BookingFormData} from '../actions/submit-booking-form'

interface CreateBookingEventProps {
  bookingConfig: BookingConfig
  bookingFormData: BookingFormData
}

export const createBookingEvent = async ({bookingConfig, bookingFormData}: CreateBookingEventProps) => {
  const timezone = tz(bookingConfig.timezone)
  const calendar = getCalendarClient(bookingConfig.calendarId)
  const createMeet = bookingFormData.type === 'online'
  const summary = `${bookingConfig.name}: ${bookingFormData.name} × ${bookingConfig.teamMember}`
  const description = bookingFormData.type === 'phone' ? `Telefonnummer ${bookingFormData.name}: ${bookingFormData.phone}` : ''
  const start = timezone(new Date(bookingFormData.slot)).toISOString()
  const end = timezone(addMinutes(new Date(bookingFormData.slot), bookingConfig.slotDuration)).toISOString()

  const event = await calendar.events.insert({
    calendarId: bookingConfig.calendarId,
    sendUpdates: 'all',
    conferenceDataVersion: createMeet ? 1 : undefined,
    requestBody: {
      summary,
      description,
      start: {dateTime: start, timeZone: bookingConfig.timezone},
      end: {dateTime: end, timeZone: bookingConfig.timezone},
      attendees: [
        {email: bookingConfig.calendarId, displayName: bookingConfig.teamMember, responseStatus: 'accepted'},
        {email: bookingFormData.email, displayName: bookingFormData.name}
      ],
      reminders: {useDefault: true},
      ...(createMeet
        ? {
            conferenceData: {
              createRequest: {
                requestId: crypto.randomUUID(),
                conferenceSolutionKey: {type: 'hangoutsMeet'}
              }
            }
          }
        : {})
    }
  })

  return event.data
}
