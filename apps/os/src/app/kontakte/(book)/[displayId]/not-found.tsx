import { Layout } from '@/components/molecules/layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <div className="px-4 sm:px-8 lg:px-16 py-8">
        <p>Dieser Kontakt ist nicht verfügbar.</p>
        <Link href="/kontakte" className="mt-2 inline-block text-sm hover:underline">Zurück zu Kontakte</Link>
      </div>
    </Layout>
  )
}
