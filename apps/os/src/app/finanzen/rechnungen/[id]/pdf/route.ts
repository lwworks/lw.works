import { loadInvoicePdf } from '@/lib/finance/load-invoice-pdf'
import { SevdeskError } from '@/lib/sevdesk/sevdesk-error'
import { NextResponse } from 'next/server'

export async function GET(_request: Request, { params }: RouteContext<'/finanzen/rechnungen/[id]/pdf'>) {
  const { id } = await params
  try {
    const pdf = await loadInvoicePdf(id)
    if (!pdf) return new NextResponse('Nicht gefunden.', { status: 404 })
    return new NextResponse(pdf.bytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${pdf.fileName}"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    if (error instanceof SevdeskError) return new NextResponse(`PDF konnte nicht geladen werden: ${error.message}`, { status: 502 })
    throw error
  }
}
