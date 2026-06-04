'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, RefreshCw, CheckCheck, Check, Clock, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/use-notifications'
import type { User } from '@/types'

export default function NotificationsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: notifications = [], isLoading, refetch } = useNotifications(currentUser?.id)
  
  const markAsReadMutation = useMarkAsRead()
  const markAllAsReadMutation = useMarkAllAsRead()

  if (!currentUser) return null

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    await markAsReadMutation.mutateAsync(id)
    refetch()
  }

  const handleMarkAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync(currentUser.id)
    refetch()
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with comments, status changes, and project deadlines.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List Container */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-1">
          <span className="text-xs font-bold text-foreground">All Notifications</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
            {unreadCount} Unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            You are all caught up! No notifications.
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {notifications.map((n) => {
              const time = new Date(n.createdAt).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
              })

              return (
                <div
                  key={n.id}
                  className={cn(
                    'py-4 flex items-start justify-between gap-3 text-xs sm:text-sm transition-colors',
                    !n.read ? 'bg-primary/5 -mx-5 px-5 rounded-xl border-l-2 border-primary' : ''
                  )}
                >
                  <div className="space-y-1">
                    <div className="font-bold text-foreground flex items-center gap-1.5">
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      {n.title}
                    </div>
                    <p className="text-muted-foreground text-xs">{n.message}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1.5">
                      <Clock size={11} />
                      {time}
                    </div>
                  </div>

                  {!n.read && (
                    <button
                      onClick={() => handleMarkAsRead(n.id)}
                      className="p-1 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      title="Mark as read"
                    >
                      <Check size={13} />
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
