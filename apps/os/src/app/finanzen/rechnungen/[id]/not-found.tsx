import { Layout } from '@/components/molecules/layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <div className="px-4 sm:px-8 lg:px-16 py-12 text-sm">
        Diese Rechnung gibt es nicht (mehr).{' '}
        <Link href="/finanzen/rechnungen" className="font-medium text-black underline dark:text-white">Zu den Rechnungen</Link>
      </div>
    </Layout>
  )
}
