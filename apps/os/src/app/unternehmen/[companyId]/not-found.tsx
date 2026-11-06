import { Layout } from '@/components/molecules/layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <div className="px-16 py-8">
        <p>Dieses Unternehmen ist nicht verfügbar.</p>
        <Link href="/unternehmen" className="mt-2 inline-block text-sm hover:underline">Zurück zu Unternehmen</Link>
      </div>
    </Layout>
  )
}
