import type { Invoice } from '@/lib/db/schema/finance'

/** The document in the SevDesk web app. */
export const getSevdeskDocumentUrl = (document: Pick<Invoice, 'kind' | 'sevdeskId'>) =>
  `https://my.sevdesk.de/fi/detail/type/${document.kind === 'credit_note' ? 'CN' : 'RE'}/id/${document.sevdeskId}`
