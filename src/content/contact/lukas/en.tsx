import type { TeamMemberPageContent } from '@/components/pages/team-member'
import { Link } from '@/i18n/link'
import type { ComponentProps } from 'react'

const content: TeamMemberPageContent = {
  metadata: {
    title: 'Book a Call with Lukas Brunkhorst — LW Works GmbH',
    description: 'Book a free consultation with Lukas Brunkhorst, CEO & Design Engineer at LW Works.'
  },
  member: {
    id: 'team-member',
    brow: 'Book a Call',
    name: 'Lukas Brunkhorst',
    role: 'CEO & Design Engineer',
    image: {
      src: '/images/lukas-brunkhorst.jpg',
      alt: 'Lukas Brunkhorst'
    },
    paragraphs: [
      'Have questions about our services or want to discuss a project? Book a free consultation — I\'ll get back to you personally.'
    ]
  },
  calendar: {
    locale: 'en',
    title: 'Book a Call',
    description: 'Duration: 30 min · Europe/Berlin',
    fields: {
      name: { label: 'Your Name', placeholder: 'John Smith' },
      email: { label: 'Email', placeholder: 'john@company.com' },
      message: { label: 'Message (optional)', placeholder: 'What would you like to discuss?' }
    },
    privacy: <>I have read the <Link href={'/privacy' as ComponentProps<typeof Link>['href']} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Privacy Policy</Link> and agree to the processing of my data.</>,
    submit: 'Book Call',
    successMessage: 'Your call has been booked! You\'ll receive a confirmation email shortly.',
    errorMessages: {
      default: 'An error occurred. Please try again.',
      botDetected: 'Request detected as automated.',
      slotTaken: 'This slot is no longer available. Please select another time.'
    },
    booking: {
      calendarId: 'lukas@lw.works',
      teamMemberSlug: 'lukas',
      timezone: 'Europe/Berlin',
      slotDurationMinutes: 30,
      advanceDays: 14,
      availableDays: [1, 2, 4, 5],
      availableHours: { start: 13, end: 17 }
    }
  }
}

export default content
