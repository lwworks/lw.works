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
      calendarId: 'lukas@lw.works',
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
      calendarId: 'lukas@lw.works',
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
