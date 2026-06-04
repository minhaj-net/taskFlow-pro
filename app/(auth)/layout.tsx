import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TaskFlow Pro — Authentication',
  description: 'Sign in or create your TaskFlow Pro account.',
}

/**
 * Auth route-group layout.
 * Clean full-screen wrapper — no Navbar, no Footer, no pt-16.
 * The root layout already supplies ThemeProvider and body styles.
 */
export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
