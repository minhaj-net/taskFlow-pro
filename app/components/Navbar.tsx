'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, Zap, LogIn, LogOut, Rocket } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import MobileMenu from './MobileMenu'
import { cn } from '@/lib/utils'
import { getSession, clearSession } from '@/lib/auth'
import { ROLE_DASHBOARD } from '@/types'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

const NOTIFICATION_COUNT = 3

export default function Navbar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dashboardPath, setDashboardPath] = useState('/dashboard')

  // Detect auth state client-side only (avoids SSR mismatch)
  useEffect(() => {
    const session = getSession()
    if (session?.user) {
      setIsLoggedIn(true)
      setDashboardPath(ROLE_DASHBOARD[session.user.role] ?? '/dashboard')
    } else {
      setIsLoggedIn(false)
    }
  }, [pathname]) // re-check on every route change

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 12)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const handleLogout = useCallback(() => {
    clearSession()
    document.cookie = 'tfp_auth=; path=/; max-age=0'
    document.cookie = 'tfp_role=; path=/; max-age=0'
    setIsLoggedIn(false)
    router.push('/login')
  }, [router])

  const handleGetStarted = useCallback(() => {
    router.push(isLoggedIn ? dashboardPath : '/login')
  }, [isLoggedIn, dashboardPath, router])

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed inset-x-0 top-0 z-30 transition-all duration-300 ease-in-out',
          scrolled
            ? 'h-14 border-b border-border/80 bg-background/80 backdrop-blur-xl shadow-sm shadow-black/5'
            : 'h-16 border-b border-transparent bg-background',
        )}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Logo ─────────────────────────────────────── */}
          <Link
            href="/"
            aria-label="TaskFlow Pro — Go to homepage"
            className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-tf-indigo shadow-md shadow-primary/30 group-hover:shadow-lg group-hover:shadow-primary/40 transition-shadow duration-200">
              <Zap size={16} className="text-primary-foreground" fill="currentColor" />
              <span className="absolute inset-0 rounded-lg ring-2 ring-primary/0 group-hover:ring-primary/30 transition-all duration-200" aria-hidden="true" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-foreground select-none">
              TaskFlow{' '}
              <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">Pro</span>
            </span>
          </Link>

          {/* ── Desktop nav ───────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'group relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  {/* Background pill */}
                  <span
                    className={cn(
                      'absolute inset-0 rounded-lg transition-all duration-150',
                      isActive
                        ? 'bg-primary/10'
                        : 'bg-transparent group-hover:bg-muted',
                    )}
                    aria-hidden="true"
                  />
                  <span className="relative">{label}</span>
                  {/* Active underline */}
                  <span
                    className={cn(
                      'absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-tf-indigo transition-all duration-200',
                      isActive ? 'w-4 opacity-100' : 'w-0 opacity-0 group-hover:w-3 group-hover:opacity-60',
                    )}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Notification bell */}
            <div className="relative">
              <button
                aria-label={`Notifications${NOTIFICATION_COUNT > 0 ? `, ${NOTIFICATION_COUNT} unread` : ''}`}
                title="Notifications"
                className={cn(
                  'group relative flex h-9 w-9 items-center justify-center rounded-lg',
                  'border border-border bg-card text-muted-foreground',
                  'hover:bg-muted hover:text-foreground',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                <Bell size={16} strokeWidth={2} className="transition-transform duration-200 group-hover:rotate-12" />
                {NOTIFICATION_COUNT > 0 && (
                  <span
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white ring-2 ring-background select-none"
                    aria-hidden="true"
                  >
                    {NOTIFICATION_COUNT > 9 ? '9+' : NOTIFICATION_COUNT}
                  </span>
                )}
              </button>
            </div>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Divider */}
            <div className="hidden md:block h-5 w-px bg-border mx-1" aria-hidden="true" />

            {/* Login / Logout */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className={cn(
                  'hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium',
                  'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                <LogOut size={15} />
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                className={cn(
                  'hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium',
                  'text-muted-foreground hover:bg-muted hover:text-foreground',
                  'transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                )}
              >
                <LogIn size={15} />
                Log in
              </Link>
            )}

            {/* Get Started / Go to Dashboard */}
            <button
              onClick={handleGetStarted}
              className={cn(
                'hidden md:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-primary-foreground',
                'bg-gradient-to-r from-primary to-tf-indigo',
                'shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35',
                'hover:scale-[1.02] active:scale-[0.98] transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <Rocket size={14} />
              {isLoggedIn ? 'Dashboard' : 'Get Started'}
            </button>

            {/* Hamburger */}
            <button
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(true)}
              className={cn(
                'md:hidden flex h-9 w-9 items-center justify-center rounded-lg',
                'border border-border bg-card text-muted-foreground',
                'hover:bg-muted hover:text-foreground',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              )}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isLoggedIn={isLoggedIn}
        dashboardPath={dashboardPath}
        onLogout={handleLogout}
      />
    </>
  )
}
