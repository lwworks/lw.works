const calendarId = 'lukas@lw.works'
const availabilityCalendarIds = [
  'c_07f215fd781393f0926768ed86f5cdcca27dafef06a54509b776e2837c3622c9@group.calendar.google.com', // Privat
  'c_8f5866b276b60208f5000aa9fff6e7bc83b4feb444af3517093f1f3e6b424b80@group.calendar.google.com', // Familie
  'c_d5ef4c06ecdaebfb68284ebbbd37ae206733017a4e2a68b53398027218c02138@group.calendar.google.com' // Feuerwehr
]

export const lukas = {
  name: 'Lukas Brunkhorst',
  image: '/images/team/lukas-brunkhorst.jpg',
  title: 'Entwickler & Geschäftsführer',
  description:
    'Ich bin seit 2017 als Entwickler selbstständig und habe Anfang 2024 die LW Works GmbH gegründet. Inzwischen durften wir bereits an Digitalisierungs- und KI-Projekten u.a. mit Airbus, BMW und Amazon arbeiten.',
  bookingOptions: {
    check: {
      id: 'check',
      name: 'Prozess-Check',
      teamMember: 'Lukas Brunkhorst',
      type: ['online', 'phone'] as BookingType,
      calendarId,
      availabilityCalendarIds,
      timezone: 'Europe/Berlin',
      slotDuration: 15,
      breakDuration: 15,
      hoursInAdvance: 24,
      daysInAdvance: 14,
      availableHours: {
        monday: {start: 17, end: 18},
        tuesday: {start: 15, end: 17},
        wednesday: {start: 14, end: 17},
        thursday: {start: 15, end: 17},
        friday: {start: 12, end: 14}
      },
      redirect: '/check/termin-bestaetigt'
    },
    bni: {
      id: 'bni',
      name: 'BNI 121',
      teamMember: 'Lukas Brunkhorst',
      type: ['online'] as BookingType,
      calendarId,
      availabilityCalendarIds,
      timezone: 'Europe/Berlin',
      slotDuration: 30,
      breakDuration: 15,
      hoursInAdvance: 24,
      daysInAdvance: 21,
      availableHours: {
        monday: {start: 17, end: 18},
        tuesday: {start: 15, end: 17},
        wednesday: {start: 14, end: 17},
        thursday: {start: 15, end: 17},
        friday: {start: 12, end: 14}
      },
      redirect: '/bni/termin-bestaetigt'
    }
  }
}
