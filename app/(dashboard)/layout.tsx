'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/app/components/dashboard/DashboardNav'
import DashboardTopbar from '@/app/components/dashboard/DashboardTopbar'
import { getSession } from '@/lib/auth'
import { useNotifications } from '@/hooks/use-notifications'
import type { User } from '@/types'
import { cn } from '@/lib/utils'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router  = useRouter()
  const [user,   setUser]              = useState<User | null>(null)
  const [collapsed, setCollapsed]      = useState(false)
  const [mobileOpen, setMobileOpen]    = useState(false)
  const [mounted, setMounted]          = useState(false)

  useEffect(() => {
    setMounted(true)
    const session = getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    setUser(session.user)
  }, [router])

  const { data: notifications } = useNotifications(user?.id)
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0

  const closeMobile = useCallback(() => setMobileOpen(false), [])

  /* ── Loading / auth guard ─────────────────────────────────── */
  if (!mounted || !user) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-[100dvh] bg-background overflow-hidden">

      {/* ── Mobile drawer backdrop ──────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────── */}
      {/* Desktop: always visible as flex child (no fixed)       */}
      {/* Mobile:  drawer sliding in from left (fixed)           */}
      <div
        className={cn(
          // Mobile: fixed drawer
          'fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <DashboardNav
          role={user.role}
          collapsed={false}            // mobile drawer is always expanded
          onToggle={closeMobile}
        />
      </div>

      {/* Desktop sidebar — static flex child, never fixed */}
      <div className="hidden md:flex flex-shrink-0">
        <DashboardNav
          role={user.role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((s) => !s)}
        />
      </div>

      {/* ── Main content area ───────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <DashboardTopbar
          user={user}
          unreadCount={unreadCount}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
