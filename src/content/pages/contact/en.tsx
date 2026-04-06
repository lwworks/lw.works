import { ContactPageContent } from '@/components/pages/contact'
import { Link } from '@/i18n/link'
import type { ComponentProps } from 'react'

const content: ContactPageContent = {
  metadata: {
    title: 'Contact — LW Works GmbH',
    description: 'Professional web development & design engineering for companies. Custom Next.js, API integrations and AI-powered automation.'
  },
  form: {
    id: 'contact',
    brow: 'Contact',
    title: 'Let’s talk about your project',
    description: 'Tell us what you are planning. We read every message and usually reply within one business day.',
    fields: {
      name: {
        label: 'Name',
        placeholder: 'Your name'
      },
      email: {
        label: 'Email',
        placeholder: 'you@company.com'
      },
      message: {
        label: 'Message',
        placeholder: 'What are you looking for? Timeline, scope, links — anything that helps.'
      }
    },
    privacy: <>I have read the <Link href={"/privacy" as ComponentProps<typeof Link>['href']} target="_blank" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800 dark:hover:text-indigo-500">Privacy Policy</Link> and agree to the processing of my data.</>,
    submit: 'Send message',
    successMessage: 'Thank you — your message was sent. We will get back to you shortly.'
  }
}

export default content
