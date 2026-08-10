import type { CalendarBookingSectionContent } from '@/components/sections/contact/calendar-booking'

export type BookingConfig = CalendarBookingSectionContent['booking']

export const bookingConfigs = {
  lukas: {
    calendarId: 'lukas@lw.works',
    teamMemberSlug: 'lukas',
    timezone: 'Europe/Berlin',
    slotDurationMinutes: 30,
    advanceDays: 14,
    availableDays: [1, 2, 4, 5],
    availableHours: { start: 13, end: 17 },
  },
  check: {
    calendarId: 'lukas@lw.works',
    teamMemberSlug: 'check',
    timezone: 'Europe/Berlin',
    slotDurationMinutes: 15,
    advanceDays: 14,
    availableDays: [1, 2, 4, 5],
    availableHours: { start: 13, end: 17 },
  },
} as const satisfies Record<string, BookingConfig>

export type BookingConfigKey = keyof typeof bookingConfigs

export function getBookingConfig(slug: string): BookingConfig | undefined {
  if (slug in bookingConfigs) {
    return bookingConfigs[slug as BookingConfigKey]
  }
  return undefined
}

export const bookingMessages = {
  errorMessages: {
    default: 'Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',
    botDetected: 'Anfrage wurde als automatisiert erkannt.',
    slotTaken: 'Dieser Termin ist leider nicht mehr verfügbar. Bitte wähle einen anderen.',
  },
  successMessage: 'Dein Termin wurde gebucht! Du erhältst eine Bestätigung per E-Mail.',
}
