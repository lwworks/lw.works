import { Footer } from '@/components/sections/footer'
import { Header } from '@/components/sections/header'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
