'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Bell, Search, Plus, Menu, LogOut, UserCircle,
  ChevronDown, Settings, Moon, Sun,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { clearSession } from '@/lib/auth'
import type { User } from '@/types'

interface Props {
  user: User
  unreadCount?: number
  onMobileMenuOpen: () => void
}

export default function DashboardTopbar({ user, unreadCount = 0, onMobileMenuOpen }: Props) {
  const router               = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [profileOpen, setProfileOpen] = useState(false)
  const isDark = resolvedTheme === 'dark'

  const handleLogout = () => {
    clearSession()
    document.cookie = 'tfp_auth=; path=/; max-age=0'
    document.cookie = 'tfp_role=; path=/; max-age=0'
    router.push('/login')
  }

  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const roleColor = ({
    admin:   'bg-danger/15   text-danger',
    manager: 'bg-warning/15  text-warning',
    member:  'bg-info/15     text-info',
  } as Record<string, string>)[user.role] ?? 'bg-muted text-muted-foreground'

  return (
    <header className="h-16 border-b border-border bg-card flex items-center gap-3 px-4 sm:px-6 shrink-0">

      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        aria-label="Open mobile menu"
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <Menu size={20} />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search projects, tasks, members…"
            className={cn(
              'w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60',
              'outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Create button */}
        <Link
          href="/dashboard/projects"
          className={cn(
            'hidden sm:inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold text-primary-foreground',
            'bg-gradient-to-r from-primary to-tf-indigo shadow-md shadow-primary/20',
            'hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-150',
          )}
        >
          <Plus size={15} />
          Create
        </Link>

        {/* Theme toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <Link
          href="/dashboard/notifications"
          className="relative h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-danger text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-card">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((s) => !s)}
            aria-label="User menu"
            aria-expanded={profileOpen}
            className="flex items-center gap-2.5 rounded-xl border border-border bg-background px-2.5 py-1.5 text-sm hover:bg-muted transition-colors"
          >
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center text-[11px] font-bold text-primary-foreground shrink-0">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-foreground leading-none">{user.name.split(' ')[0]}</div>
              <div className={cn('text-[10px] font-medium leading-none mt-0.5 capitalize', roleColor.split(' ')[1] ?? '')}>
                {user.role}
              </div>
            </div>
            <ChevronDown size={13} className={cn('text-muted-foreground transition-transform duration-200', profileOpen && 'rotate-180')} />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} aria-hidden="true" />
              <div className="absolute right-0 top-full mt-1.5 z-20 w-52 rounded-xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden">
                {/* Header */}
                <div className="px-4 py-3 border-b border-border">
                  <div className="text-sm font-semibold text-foreground">{user.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  <span className={cn('mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full', roleColor)}>
                    {user.role}
                  </span>
                </div>

                {/* Links */}
                <div className="py-1">
                  <Link href="/dashboard/profile" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <UserCircle size={15} className="text-muted-foreground" />
                    Profile
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Settings size={15} className="text-muted-foreground" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-border py-1">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors">
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
