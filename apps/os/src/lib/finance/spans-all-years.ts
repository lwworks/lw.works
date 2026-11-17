import type { InvoiceView } from '@/lib/db/invoices/invoice-view'

/** Outstanding invoices matter regardless of their date, so these tabs list every year (like the outstanding KPIs). */
export const spansAllYears = (view: InvoiceView) => view === 'open' || view === 'overdue'
