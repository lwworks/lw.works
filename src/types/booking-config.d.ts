type BookingConfig = {
  id: string // Booking ID, e.g. 'check'
  name: string // Booking name, e.g. 'Prozess-Check'
  teamMember: string // Team member name, e.g. 'Lukas Brunkhorst'
  type: BookingType // Available meeting types
  calendarId: string // Google Calendar ID
  timezone: string // Timezone for the calendar
  slotDuration: number // Event duration in minutes
  breakDuration: number // Break duration in minutes
  hoursInAdvance: number // Number of hours in advance for earliest available slot
  daysInAdvance: number // Number of days users can book in advance
  availableHours: {
    // Available hours for each day of the week
    monday?: {start: number; end: number} // e.g. { start: 14, end: 17 } for 14:00 - 17:00
    tuesday?: {start: number; end: number}
    wednesday?: {start: number; end: number}
    thursday?: {start: number; end: number}
    friday?: {start: number; end: number}
    saturday?: {start: number; end: number}
    sunday?: {start: number; end: number}
  }
}
