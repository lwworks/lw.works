import {CalendarBookingSectionContent} from '@/components/sections/contact/calendar-booking'
import {google} from 'googleapis'

const BUFFER_MINUTES = 15

function getAuthClient(subject: string) {
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject
  })
}

function getCalendarClient(subject: string) {
  return google.calendar({version: 'v3', auth: getAuthClient(subject)})
}

export type AvailableSlot = {
  start: string
  end: string
  displayStart: string
  displayEnd: string
}

export type DaySlots = {
  date: string
  displayDate: string
  displayWeekday: string
  slots: AvailableSlot[]
}

export async function getAvailableSlots(from: string, to: string, config: CalendarBookingSectionContent['booking']): Promise<DaySlots[]> {
  const calendar = getCalendarClient(config.calendarId)

  const timeMin = new Date(`${from}T00:00:00`)
  const timeMax = new Date(`${to}T23:59:59`)

  const freebusyResponse = await calendar.freebusy.query({
    requestBody: {
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      timeZone: config.timezone,
      items: [{id: config.calendarId}]
    }
  })

  const busySlots = freebusyResponse.data.calendars?.[config.calendarId]?.busy ?? []

  const days: DaySlots[] = []
  const current = new Date(timeMin)
  const now = new Date()

  const dateFormatter = new Intl.DateTimeFormat('de-DE', {
    day: 'numeric',
    month: 'short',
    timeZone: config.timezone
  })
  const weekdayFormatter = new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    timeZone: config.timezone
  })
  const timeFormatter = new Intl.DateTimeFormat('de-DE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: config.timezone
  })

  while (current <= timeMax) {
    const dayOfWeek = current.getDay()
    const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek

    if (config.availableDays.includes(isoDay)) {
      const dateStr = current.toISOString().split('T')[0]
      const slots: AvailableSlot[] = []

      for (let hour = config.availableHours.start; hour < config.availableHours.end; ) {
        const minute = (hour % 1) * 60
        const fullHour = Math.floor(hour)

        const slotStart = new Date(current)
        slotStart.setHours(fullHour, minute, 0, 0)

        const slotEnd = new Date(slotStart)
        slotEnd.setMinutes(slotEnd.getMinutes() + config.slotDurationMinutes)

        // Skip if slot is in the past
        if (slotStart > now) {
          // Check if slot overlaps with any busy period
          const isConflict = busySlots.some((busy) => {
            const busyStart = new Date(busy.start!)
            const busyEnd = new Date(busy.end!)
            return slotStart < busyEnd && slotEnd > busyStart
          })

          if (!isConflict) {
            slots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString(),
              displayStart: timeFormatter.format(slotStart),
              displayEnd: timeFormatter.format(slotEnd)
            })
          }
        }

        hour += (config.slotDurationMinutes + BUFFER_MINUTES) / 60
      }

      days.push({
        date: dateStr,
        displayDate: dateFormatter.format(current),
        displayWeekday: weekdayFormatter.format(current),
        slots
      })
    }

    current.setDate(current.getDate() + 1)
  }

  return days
}

export async function isSlotStillAvailable(calendarId: string, startTime: string, endTime: string, timezone: string): Promise<boolean> {
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

export async function createBookingEvent(params: {
  calendarId: string
  summary: string
  description: string
  startTime: string
  endTime: string
  timezone: string
  attendeeEmail: string
  attendeeName: string
  createMeet?: boolean
}) {
  const calendar = getCalendarClient(params.calendarId)
  const createMeet = params.createMeet ?? false

  const event = await calendar.events.insert({
    calendarId: params.calendarId,
    sendUpdates: 'all',
    conferenceDataVersion: createMeet ? 1 : undefined,
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: {dateTime: params.startTime, timeZone: params.timezone},
      end: {dateTime: params.endTime, timeZone: params.timezone},
      attendees: [{email: params.attendeeEmail, displayName: params.attendeeName}],
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
