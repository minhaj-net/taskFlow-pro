'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users,
  BarChart3, History, Bell, Settings, UserCircle,
  ChevronLeft, ChevronRight, Zap, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Role } from '@/types'

// ── Navigation config per role ─────────────────────────────────
export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  /** exact match only (no startsWith) */
  exact?: boolean
}

export function getNavItems(role: Role): NavItem[] {
  if (role === 'admin') return [
    { label: 'Dashboard',     href: '/',                          icon: LayoutDashboard, exact: true },
    { label: 'Projects',      href: '/dashboard/projects',        icon: FolderKanban  },
    { label: 'Tasks',         href: '/dashboard/tasks',           icon: CheckSquare   },
    { label: 'Team',          href: '/dashboard/team',            icon: Users         },
    { label: 'Users',         href: '/dashboard/users',           icon: ShieldCheck   },
    { label: 'Analytics',     href: '/dashboard/analytics',       icon: BarChart3     },
    { label: 'Activity',      href: '/dashboard/activity',        icon: History       },
    { label: 'Notifications', href: '/dashboard/notifications',   icon: Bell          },
    { label: 'Profile',       href: '/dashboard/profile',         icon: UserCircle    },
    { label: 'Settings',      href: '/dashboard/settings',        icon: Settings      },
  ]

  if (role === 'manager') return [
    { label: 'Dashboard',     href: '/',                          icon: LayoutDashboard, exact: true },
    { label: 'Projects',      href: '/dashboard/projects',        icon: FolderKanban  },
    { label: 'Tasks',         href: '/dashboard/tasks',           icon: CheckSquare   },
    { label: 'Team',          href: '/dashboard/team',            icon: Users         },
    { label: 'Analytics',     href: '/dashboard/analytics',       icon: BarChart3     },
    { label: 'Activity',      href: '/dashboard/activity',        icon: History       },
    { label: 'Notifications', href: '/dashboard/notifications',   icon: Bell          },
    { label: 'Profile',       href: '/dashboard/profile',         icon: UserCircle    },
    { label: 'Settings',      href: '/dashboard/settings',        icon: Settings      },
  ]

  // member
  return [
    { label: 'Dashboard',     href: '/',                          icon: LayoutDashboard, exact: true },
    { label: 'My Tasks',      href: '/dashboard/tasks',           icon: CheckSquare   },
    { label: 'My Projects',   href: '/dashboard/projects',        icon: FolderKanban  },
    { label: 'Notifications', href: '/dashboard/notifications',   icon: Bell          },
    { label: 'Profile',       href: '/dashboard/profile',         icon: UserCircle    },
    { label: 'Settings',      href: '/dashboard/settings',        icon: Settings      },
  ]
}

// ── Sidebar component ──────────────────────────────────────────
interface Props {
  role: Role
  collapsed: boolean
  onToggle: () => void
}

export default function DashboardNav({ role, collapsed, onToggle }: Props) {
  const pathname = usePathname()
  const navItems = getNavItems(role)

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        'h-full',
        collapsed ? 'w-16' : 'w-60',
      )}
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className={cn(
        'flex h-16 items-center border-b border-border px-4 shrink-0',
        collapsed ? 'justify-center' : 'justify-between gap-2',
      )}>
        <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
          <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center shadow-md shadow-primary/25">
            <Zap size={16} className="text-primary-foreground" fill="currentColor" />
          </div>
          {!collapsed && (
            <span className="text-sm font-bold text-foreground truncate">
              TaskFlow{' '}
              <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
                Pro
              </span>
            </span>
          )}
        </Link>

        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Nav items */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5"
        aria-label="Dashboard navigation"
      >
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/')

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              title={collapsed ? label : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                size={18}
                className={cn(
                  'shrink-0',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              {!collapsed && (
                <span className="flex-1 truncate">{label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Role badge at bottom */}
      {!collapsed && (
        <div className="p-4 border-t border-border shrink-0">
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider',
              role === 'admin'   && 'bg-danger/10  text-danger',
              role === 'manager' && 'bg-warning/10 text-warning',
              role === 'member'  && 'bg-info/10    text-info',
            )}
          >
            <ShieldCheck size={14} />
            {role}
          </div>
        </div>
      )}
    </aside>
  )
}
