import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ThemeProvider from './components/ThemeProvider'
import QueryProvider from './components/QueryProvider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TaskFlow Pro — Smart Project & Task Collaboration',
  description:
    'A premium project and task collaboration system for modern teams. Plan, build, and ship faster with TaskFlow Pro.',
}

/**
 * Root layout — pure shell.
 * Provides fonts, theme, global CSS, and the base body.
 * Navbar / Footer are added by route-group layouts:
 *   • (marketing)/layout.tsx  → landing pages (with Navbar + Footer)
 *   • (auth)/layout.tsx       → auth pages (clean, no chrome)
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
