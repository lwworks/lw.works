/** The parts of SevDesk API v1 objects the OS reads. Numbers arrive as strings. */

export type SevdeskRef = { id: string; objectName: string }

export type SevdeskContactObject = {
  id: string
  name: string | null
  surename: string | null
  familyname: string | null
  customerNumber: string | null
  parent: SevdeskRef | null
}

type SevdeskDocumentObject = {
  id: string
  contact: SevdeskRef | null
  update: string | null
  header: string | null
  addressName: string | null
  status: string
  currency: string | null
  payDate: string | null
  sumNet: string
  sumGross: string
  sumNetForeignCurrency: string | null
  sumGrossForeignCurrency: string | null
}

export type SevdeskInvoiceObject = SevdeskDocumentObject & {
  invoiceNumber: string | null
  invoiceDate: string
  invoiceType: string
  timeToPay: string | null
  paidAmount: number | string | null
  origin?: SevdeskRef | null
}

export type SevdeskCreditNoteObject = SevdeskDocumentObject & {
  creditNoteNumber: string | null
  creditNoteDate: string
  refSrcInvoice?: SevdeskRef | null
}

export type SevdeskPositionObject = {
  id: string
  name: string | null
  text: string | null
  quantity: string
  priceNet: string | null
  sumNet: string
  sumNetForeignCurrency: string | null
  taxRate: string | null
  positionNumber: string | null
}
