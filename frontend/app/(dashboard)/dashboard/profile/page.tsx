'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Shield, MapPin, Building, Key } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useTasks } from '@/hooks/use-tasks'
import type { User as UserType } from '@/types'

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: tasks = [] } = useTasks()

  if (!currentUser) return null

  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id)
  const completed = myTasks.filter((t) => t.status === 'completed').length
  const pending = myTasks.length - completed
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          My Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account information and view your role metrics.
        </p>
      </div>

      {/* Main card */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        {/* Banner header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 border-b border-border pb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-extrabold text-xl text-primary-foreground shadow-md">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-foreground">{currentUser.name}</h2>
            <span className={cn(
              'inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
              currentUser.role === 'admin' && 'bg-danger/10 text-danger',
              currentUser.role === 'manager' && 'bg-warning/10 text-warning',
              currentUser.role === 'member' && 'bg-info/10 text-info'
            )}>
              {currentUser.role}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 text-xs sm:text-sm">
          {/* Email */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <Mail size={16} className="text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Email Address</span>
              <span className="font-semibold text-foreground">{currentUser.email}</span>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <Building size={16} className="text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Department</span>
              <span className="font-semibold text-foreground">{currentUser.department}</span>
            </div>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <Calendar size={16} className="text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Joined Date</span>
              <span className="font-semibold text-foreground">
                {new Date(currentUser.joinedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Auth Key status */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
            <Key size={16} className="text-primary shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block uppercase font-medium">Security Status</span>
              <span className="font-semibold text-emerald">Session Secure</span>
            </div>
          </div>
        </div>

        {/* Task stats card */}
        <div className="border-t border-border pt-6 space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">My Task Summary</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/40 p-3 rounded-xl border border-border/40">
              <span className="text-xl font-extrabold text-foreground">{myTasks.length}</span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 uppercase tracking-wide">Assigned</span>
            </div>
            <div className="bg-emerald/10 p-3 rounded-xl border border-emerald/20">
              <span className="text-xl font-extrabold text-emerald">{completed}</span>
              <span className="text-[10px] text-emerald block mt-0.5 uppercase tracking-wide">Completed</span>
            </div>
            <div className="bg-amber/10 p-3 rounded-xl border border-amber/20">
              <span className="text-xl font-extrabold text-amber">{pending}</span>
              <span className="text-[10px] text-amber block mt-0.5 uppercase tracking-wide">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
