export const TIME_ZONE = 'Europe/Berlin'

const dateKeyFormat = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE })

/** Calendar date in Europe/Berlin as `YYYY-MM-DD`. */
export const toZonedDateKey = (date: Date) => dateKeyFormat.format(date)
