import { CheckPage } from '@/components/pages/check'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'Kostenloser Prozess-Check',
  description: '',
}

export default async function Check() {
  return <CheckPage />
}
