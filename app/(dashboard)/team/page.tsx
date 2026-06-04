'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Mail, Calendar, CheckCircle2,
  Clock, Shield, BarChart2, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useUsers } from '@/hooks/use-users'
import { useTasks } from '@/hooks/use-tasks'
import type { User, Task } from '@/types'

export default function TeamPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('all')
  const [expandedMember, setExpandedMember] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()

  if (loadingUsers || loadingTasks) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Get unique departments for filtering
  const departments = Array.from(new Set(users.map(u => u.department)))

  // Filter team members
  const filteredMembers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || u.department === deptFilter
    return matchSearch && matchDept
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          Team Members
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View collaboration statistics, roles, and current workloads for all team members.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className={cn(
              'w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60',
              'outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
            )}
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
          <Filter size={14} />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-transparent border-none text-foreground outline-none text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        {filteredMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id)
          const completed = memberTasks.filter((t) => t.status === 'completed').length
          const total = memberTasks.length
          const pending = total - completed
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0
          const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          const isExpanded = expandedMember === member.id

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:shadow-md transition-all duration-200"
            >
              {/* Profile info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-sm text-primary-foreground shrink-0 shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                      {member.name}
                      {member.id === currentUser?.id && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">You</span>
                      )}
                    </h3>
                    <span className="text-xs text-muted-foreground block">{member.department}</span>
                  </div>
                </div>

                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                  member.role === 'admin' && 'bg-danger/10 text-danger',
                  member.role === 'manager' && 'bg-warning/10 text-warning',
                  member.role === 'member' && 'bg-info/10 text-info'
                )}>
                  {member.role}
                </span>
              </div>

              {/* Workload Stats grid */}
              <div className="grid grid-cols-3 gap-2.5 bg-muted/40 border border-border/40 p-3 rounded-xl text-center text-xs">
                <div>
                  <div className="font-extrabold text-foreground">{total}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">Total Tasks</div>
                </div>
                <div>
                  <div className="font-extrabold text-emerald">{completed}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">Completed</div>
                </div>
                <div>
                  <div className="font-extrabold text-amber">{pending}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wide">Pending</div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Productivity Rate</span>
                  <span>{percent}% Completed</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-tf-indigo h-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Contact info and Expandable active tasks */}
              <div className="border-t border-border/60 pt-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail size={12} />
                    {member.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    Joined {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {total > 0 && (
                  <div>
                    <button
                      onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                      className="w-full flex items-center justify-between text-xs text-primary hover:text-primary/80 font-semibold focus:outline-none"
                    >
                      <span>{isExpanded ? 'Hide' : 'Show'} Assigned Tasks ({total})</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-3 space-y-2"
                        >
                          {memberTasks.map((t) => (
                            <a
                              key={t.id}
                              href={`/dashboard/tasks/${t.id}`}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 hover:bg-muted/40 transition-colors text-xs"
                            >
                              <span className={cn(
                                'font-semibold text-foreground truncate max-w-[180px]',
                                t.status === 'completed' && 'line-through text-muted-foreground'
                              )}>
                                {t.title}
                              </span>
                              <span className={cn(
                                'text-[9px] font-bold px-2 py-0.5 rounded-full uppercase',
                                t.status === 'completed' && 'bg-emerald/10 text-emerald',
                                t.status === 'in-progress' && 'bg-indigo/10 text-indigo',
                                t.status === 'todo' && 'bg-slate-500/10 text-slate-500'
                              )}>
                                {t.status}
                              </span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
