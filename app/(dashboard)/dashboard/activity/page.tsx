'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { History, RefreshCw, Layers, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useActivities } from '@/hooks/use-activities'
import type { User as UserType } from '@/types'

export default function ActivityPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
      router.replace('/dashboard/dashboard')
      return
    }
    setCurrentUser(session.user)
  }, [router])

  const { data: logs = [], isLoading } = useActivities()

  if (!currentUser) return null

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <History className="h-8 w-8 text-primary" />
          Activity Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review a complete history audit timeline of all tasks, projects, and member activities.
        </p>
      </div>

      {/* Timeline Card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        {logs.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground">
            No activity logs recorded yet.
          </div>
        ) : (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/70">
            {logs.map((log, idx) => {
              const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              const date = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                  className="relative text-xs sm:text-sm"
                >
                  {/* Timeline bullet */}
                  <span className="absolute -left-[29px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-card bg-primary flex items-center justify-center shadow-sm shrink-0" />
                  
                  <div className="bg-muted/30 border border-border/40 p-3 rounded-2xl space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <User size={12} className="text-muted-foreground" />
                        {log.userName}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1.5">
                        <Calendar size={11} />
                        {date} at {time}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Performed action <span className="font-bold text-foreground lowercase">{log.action}</span> on{' '}
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary capitalize">
                        {log.entityType}
                      </span>{' '}
                      named <span className="font-bold text-foreground">{log.entityName}</span>.
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
