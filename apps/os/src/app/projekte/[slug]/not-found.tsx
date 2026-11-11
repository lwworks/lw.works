import { Layout } from '@/components/molecules/layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout>
      <div className="px-16 py-8">
        <p>Dieses Projekt ist nicht verfügbar.</p>
        <Link href="/projekte" className="mt-2 inline-block text-sm hover:underline">Zurück zu Projekte</Link>
      </div>
    </Layout>
  )
}
