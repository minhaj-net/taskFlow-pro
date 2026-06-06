'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, RefreshCw, CheckCheck, Check, Clock,
  Trash2, X, BellOff, FolderKanban, CheckSquare,
  UserCheck, Shield, Zap, AlertCircle, Users,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import {
  useNotifications, useMarkAsRead, useMarkAllAsRead,
  useDeleteNotification, useClearAllNotifications,
} from '@/hooks/use-notifications'
import type { User } from '@/types'

// ── Notification type config ──────────────────────────────────
const TYPE_CONFIG: Record<string, {
  icon: React.ElementType
  iconBg: string
  iconColor: string
  label: string
}> = {
  task_assigned:    { icon: CheckSquare,  iconBg: 'bg-blue-500/10',    iconColor: 'text-blue-500',    label: 'Task Assigned'    },
  task_completed:   { icon: CheckSquare,  iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500', label: 'Task Completed'   },
  task_updated:     { icon: CheckSquare,  iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-500',   label: 'Task Updated'     },
  task_overdue:     { icon: AlertCircle,  iconBg: 'bg-red-500/10',     iconColor: 'text-red-500',     label: 'Task Overdue'     },
  project_created:  { icon: FolderKanban, iconBg: 'bg-primary/10',     iconColor: 'text-primary',     label: 'Project Created'  },
  project_updated:  { icon: FolderKanban, iconBg: 'bg-amber-500/10',   iconColor: 'text-amber-500',   label: 'Project Updated'  },
  project_completed:{ icon: FolderKanban, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500', label: 'Project Done'     },
  member_joined:    { icon: Users,        iconBg: 'bg-teal-500/10',    iconColor: 'text-teal-500',    label: 'Member Joined'    },
  member_removed:   { icon: Users,        iconBg: 'bg-red-500/10',     iconColor: 'text-red-500',     label: 'Member Removed'   },
  deadline_reminder:{ icon: Clock,        iconBg: 'bg-orange-500/10',  iconColor: 'text-orange-500',  label: 'Deadline Soon'    },
  role_changed:     { icon: Shield,       iconBg: 'bg-purple-500/10',  iconColor: 'text-purple-500',  label: 'Role Changed'     },
}

const DEFAULT_CONFIG = { icon: Bell, iconBg: 'bg-muted', iconColor: 'text-muted-foreground', label: 'Notification' }

// ── Filter tabs ───────────────────────────────────────────────
const FILTERS = [
  { id: 'all',      label: 'All'       },
  { id: 'unread',   label: 'Unread'    },
  { id: 'task',     label: 'Tasks'     },
  { id: 'project',  label: 'Projects'  },
  { id: 'member',   label: 'Members'   },
]

export default function NotificationsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [filter, setFilter]           = useState('all')
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: notifications = [], isLoading, refetch } = useNotifications(currentUser?.id)
  const markAsReadMutation    = useMarkAsRead()
  const markAllMutation       = useMarkAllAsRead()
  const deleteOneMutation     = useDeleteNotification()
  const clearAllMutation      = useClearAllNotifications()

  if (!currentUser) return null

  const unreadCount = notifications.filter(n => !n.read).length

  // ── Filter logic ─────────────────────────────────────────────
  const filtered = notifications.filter(n => {
    if (filter === 'unread')  return !n.read
    if (filter === 'task')    return n.type.startsWith('task')
    if (filter === 'project') return n.type.startsWith('project')
    if (filter === 'member')  return n.type.startsWith('member') || n.type === 'role_changed'
    return true
  })

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id)
  }

  const handleMarkAll = async () => {
    await markAllMutation.mutateAsync()
  }

  const handleDelete = async (id: string) => {
    await deleteOneMutation.mutateAsync(id)
  }

  const handleClearAll = async () => {
    await clearAllMutation.mutateAsync()
    setConfirmClear(false)
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {currentUser.role === 'member'
              ? 'Your task assignments, updates, and project alerts.'
              : currentUser.role === 'manager'
              ? "Your team's activity and project updates."
              : 'Full system-wide alerts and team activity.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button onClick={handleMarkAll} disabled={markAllMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors shadow-sm">
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button onClick={() => setConfirmClear(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors shadow-sm">
              <Trash2 size={13} />
              Clear all
            </button>
          )}
          <button onClick={() => refetch()}
            className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted transition-colors shadow-sm">
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Stats chips ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-foreground shadow-sm">
          <Bell size={11} className="text-primary" />
          {notifications.length} total
        </span>
        {unreadCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Zap size={11} />
            {unreadCount} unread
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground capitalize shadow-sm">
          <Shield size={11} />
          {currentUser.role}
        </span>
      </div>

      {/* ── Filter tabs ─────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map(f => {
          const count = f.id === 'all' ? notifications.length
            : f.id === 'unread' ? notifications.filter(n => !n.read).length
            : f.id === 'task'    ? notifications.filter(n => n.type.startsWith('task')).length
            : f.id === 'project' ? notifications.filter(n => n.type.startsWith('project')).length
            : notifications.filter(n => n.type.startsWith('member') || n.type === 'role_changed').length

          return (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border',
                filter === f.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted',
              )}>
              {f.label}
              {count > 0 && (
                <span className={cn('ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold',
                  filter === f.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'
                )}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Notification list ───────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <BellOff className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-semibold text-foreground">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              {filter === 'unread'
                ? "You're all caught up!"
                : "Notifications will appear here when you or your team take actions."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            <AnimatePresence initial={false}>
              {filtered.map((n, idx) => {
                const cfg   = TYPE_CONFIG[n.type] ?? DEFAULT_CONFIG
                const Icon  = cfg.icon
                const date  = new Date(n.createdAt)
                const now   = new Date()
                const diffMs = now.getTime() - date.getTime()
                const diffMin = Math.floor(diffMs / 60000)
                const timeStr = diffMin < 1   ? 'just now'
                  : diffMin < 60  ? `${diffMin}m ago`
                  : diffMin < 1440 ? `${Math.floor(diffMin / 60)}h ago`
                  : date.toLocaleDateString([], { month: 'short', day: 'numeric' })

                return (
                  <motion.div key={n.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, height: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className={cn(
                      'group flex items-start gap-4 p-4 transition-colors hover:bg-muted/30',
                      !n.read && 'bg-primary/5 border-l-2 border-primary',
                    )}
                  >
                    {/* Icon */}
                    <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5', cfg.iconBg)}>
                      <Icon size={16} className={cfg.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                          <span className="text-sm font-bold text-foreground">{n.title}</span>
                          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider', cfg.iconBg, cfg.iconColor)}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock size={10} />{timeStr}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.read && (
                            <button onClick={() => handleMarkAsRead(n.id)}
                              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Mark as read">
                              <Check size={12} />
                            </button>
                          )}
                          {(n as any).link && (n as any).link !== '/dashboard' && (
                            <a href={(n as any).link}
                              className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="View">
                              <Zap size={12} />
                            </a>
                          )}
                          <button onClick={() => handleDelete(n.id)}
                            className="p-1 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                            title="Delete">
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Confirm clear modal ─────────────────────────────────── */}
      <AnimatePresence>
        {confirmClear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmClear(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10">
              <h2 className="text-lg font-bold text-foreground">Clear all notifications?</h2>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently delete all {notifications.length} notifications. This cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setConfirmClear(false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={handleClearAll} disabled={clearAllMutation.isPending}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-all disabled:opacity-60">
                  {clearAllMutation.isPending ? 'Clearing…' : 'Clear All'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
