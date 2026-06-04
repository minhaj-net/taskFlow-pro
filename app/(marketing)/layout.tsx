import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

/**
 * Marketing layout — wraps all public landing pages.
 * Provides the sticky Navbar, the Footer, and the
 * pt-16 offset that clears the fixed navbar height.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col pt-16">
        {children}
      </main>
      <Footer />
    </>
  )
}
