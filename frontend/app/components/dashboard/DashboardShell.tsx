'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import DashboardNav from '@/app/components/dashboard/DashboardNav'
import DashboardTopbar from '@/app/components/dashboard/DashboardTopbar'
import { getSession } from '@/lib/auth'
import { useNotifications } from '@/hooks/use-notifications'
import type { User } from '@/types'
import { cn } from '@/lib/utils'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user,       setUser]       = useState<User | null>(null)
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted,    setMounted]    = useState(false)

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

  if (!mounted || !user) {
    return (
      <div className="flex h-[100dvh] items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ease-in-out',
        mobileOpen ? 'translate-x-0' : '-translate-x-full',
      )}>
        <div className="h-full overflow-y-auto">
          <DashboardNav role={user.role} collapsed={false} onToggle={closeMobile} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0 h-full overflow-y-auto">
        <DashboardNav
          role={user.role}
          collapsed={collapsed}
          onToggle={() => setCollapsed((s) => !s)}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden h-full">
        <div className="flex-shrink-0">
          <DashboardTopbar
            user={user}
            unreadCount={unreadCount}
            onMobileMenuOpen={() => setMobileOpen(true)}
          />
        </div>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
