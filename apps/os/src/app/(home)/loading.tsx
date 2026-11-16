import { HomePage } from '@/components/pages/home'

// The static mock content is the instant loading state; the finance tile streams in with the page.
export default function Loading() {
  return <HomePage finances={null} />
}
