'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FolderKanban, CheckSquare, CheckCircle2, Clock, AlertTriangle,
  ArrowUpRight, Calendar, User, ChevronRight, RefreshCw, BarChart2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { useRecentActivities } from '@/hooks/use-activities'
import type { Role, User as UserType, Project, Task } from '@/types'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area
} from 'recharts'

interface DashboardHomeProps {
  role: Role
  currentUser: UserType
}

export default function DashboardHome({ role, currentUser }: DashboardHomeProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // ── Queries ──────────────────────────────────────────────────
  const { data: projects = [], isLoading: loadingProjects } = useProjects()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const { data: activities = [], isLoading: loadingActivities } = useRecentActivities(10)

  // ── Filtering Data by Role ───────────────────────────────────
  const filteredProjects = role === 'member'
    ? projects.filter((p) => p.memberIds.includes(currentUser.id))
    : projects

  const filteredTasks = role === 'member'
    ? tasks.filter((t) => t.assigneeId === currentUser.id)
    : tasks

  // ── Calculations ─────────────────────────────────────────────
  const totalProjects = filteredProjects.length
  const totalTasks = filteredTasks.length
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed').length
  const pendingTasks = filteredTasks.filter((t) => t.status === 'todo' || t.status === 'in-progress').length
  
  const overdueTasks = filteredTasks.filter((t) => {
    if (t.status === 'completed') return false
    if (!t.dueDate) return false
    return new Date(t.dueDate) < new Date()
  }).length

  // High priority tasks
  const highPriorityTasks = filteredTasks
    .filter((t) => t.priority === 'high' && t.status !== 'completed')
    .slice(0, 5)

  // Upcoming deadlines (within next 30 days)
  const upcomingDeadlines = [...filteredTasks]
    .filter((t) => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  // Member workload (tasks count per member)
  const memberWorkload = users.map((user) => {
    const userTasks = tasks.filter((t) => t.assigneeId === user.id)
    const userCompleted = userTasks.filter((t) => t.status === 'completed').length
    const userPending = userTasks.length - userCompleted
    return {
      name: user.name,
      avatar: user.avatar,
      department: user.department,
      total: userTasks.length,
      completed: userCompleted,
      pending: userPending,
    }
  }).sort((a, b) => b.total - a.total)

  // ── Chart Data ───────────────────────────────────────────────
  // 1. Task status distribution
  const statusChartData = [
    { name: 'To Do', value: filteredTasks.filter((t) => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', value: filteredTasks.filter((t) => t.status === 'in-progress').length, color: '#6366f1' },
    { name: 'Completed', value: completedTasks, color: '#10b981' },
  ].filter(d => d.value > 0)

  // 2. Tasks by priority
  const priorityChartData = [
    { name: 'Low', count: filteredTasks.filter((t) => t.priority === 'low').length },
    { name: 'Medium', count: filteredTasks.filter((t) => t.priority === 'medium').length },
    { name: 'High', count: filteredTasks.filter((t) => t.priority === 'high').length },
  ]

  // 3. Project progress trend (completion rate per project)
  const projectTrendData = filteredProjects.map((p) => {
    const projectTasks = tasks.filter((t) => t.projectId === p.id)
    const total = projectTasks.length
    const completed = projectTasks.filter((t) => t.status === 'completed').length
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0
    return {
      name: p.name.length > 15 ? p.name.substring(0, 15) + '…' : p.name,
      rate,
    }
  })

  const isLoading = loadingProjects || loadingTasks || loadingUsers

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground animate-pulse">Loading dashboard statistics…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Welcome back, <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">{currentUser.name}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here is what is happening with your projects and tasks today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: 'Total Projects', value: totalProjects, icon: FolderKanban, color: 'text-primary bg-primary/10 border-primary/20' },
          { label: 'Total Tasks', value: totalTasks, icon: CheckSquare, color: 'text-tf-indigo bg-tf-indigo/10 border-tf-indigo/20' },
          { label: 'Completed Tasks', value: completedTasks, icon: CheckCircle2, color: 'text-emerald bg-emerald/10 border-emerald/20' },
          { label: 'Pending Tasks', value: pendingTasks, icon: Clock, color: 'text-amber bg-amber/10 border-amber/20' },
          { label: 'Overdue Tasks', value: overdueTasks, icon: AlertTriangle, color: 'text-danger bg-danger/10 border-danger/20' },
        ].map((kpi, idx) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.15 } }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
              <div className={cn('h-8 w-8 rounded-xl flex items-center justify-center border', kpi.color)}>
                <kpi.icon size={16} />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">{kpi.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Status Distribution */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-primary" />
              Task Status Distribution
            </h2>
          </div>
          <div className="h-60 flex items-center justify-center">
            {isClient && statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No data available</div>
            )}
          </div>
        </div>

        {/* Priority Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-tf-indigo" />
              Tasks by Priority
            </h2>
          </div>
          <div className="h-60 flex items-center justify-center">
            {isClient && totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]}>
                    {priorityChartData.map((entry, index) => {
                      const colors = ['#3b82f6', '#f59e0b', '#ef4444'] // Low, Medium, High
                      return <Cell key={`cell-${index}`} fill={colors[index]} />
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No data available</div>
            )}
          </div>
        </div>

        {/* Project Completion Trend */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-emerald" />
              Project Progress rate (%)
            </h2>
          </div>
          <div className="h-60 flex items-center justify-center">
            {isClient && projectTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorRate)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Second Level Grid: Workloads & Deadlines & Activities */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left column: Workload or High Priority Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* High Priority Tasks */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground">High Priority Tasks</h2>
              <span className="text-xs text-muted-foreground">Needs immediate action</span>
            </div>
            {highPriorityTasks.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No active high-priority tasks. Good job!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground font-semibold">
                      <th className="pb-2">Task</th>
                      <th className="pb-2">Project</th>
                      <th className="pb-2">Due Date</th>
                      <th className="pb-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {highPriorityTasks.map((t) => {
                      const proj = projects.find(p => p.id === t.projectId)
                      return (
                        <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 font-medium text-foreground max-w-[200px] truncate">{t.title}</td>
                          <td className="py-3 text-muted-foreground text-xs">{proj?.name ?? 'Unknown'}</td>
                          <td className="py-3 text-muted-foreground text-xs flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </td>
                          <td className="py-3 text-right">
                            <span className={cn(
                              'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                              t.status === 'in-progress' ? 'bg-indigo/15 text-indigo' : 'bg-amber/15 text-amber'
                            )}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Workload Summary */}
          {role !== 'member' && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
                <h2 className="text-sm font-bold text-foreground">Team Member Workload Summary</h2>
                <span className="text-xs text-muted-foreground">Tasks distribution</span>
              </div>
              <div className="space-y-4">
                {memberWorkload.slice(0, 4).map((member) => {
                  const percent = member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0
                  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  return (
                    <div key={member.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-tf-indigo/20 border border-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{member.name}</div>
                          <div className="text-[11px] text-muted-foreground leading-none">{member.department}</div>
                        </div>
                      </div>
                      
                      <div className="flex-1 max-w-xs sm:mx-6">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Progress</span>
                          <span>{member.completed}/{member.total} tasks ({percent}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-primary to-tf-indigo h-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald/10 text-emerald">
                          {member.completed} done
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber/10 text-amber">
                          {member.pending} active
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Recent Activities & Upcoming Deadlines */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground">Upcoming Deadlines</h2>
              <span className="text-xs text-muted-foreground">Next tasks due</span>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No upcoming deadlines.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map((t) => {
                  const diff = new Date(t.dueDate).getTime() - new Date().getTime()
                  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24))
                  return (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-foreground truncate">{t.title}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">
                          Due {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0',
                        daysLeft <= 2 ? 'bg-danger/10 text-danger' :
                        daysLeft <= 5 ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'
                      )}>
                        {daysLeft <= 0 ? 'Overdue' : daysLeft === 1 ? '1 day left' : `${daysLeft} days left`}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
              <h2 className="text-sm font-bold text-foreground">Recent Activity</h2>
              <span className="text-xs text-muted-foreground">Latest events</span>
            </div>
            {activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No recent activity.
              </div>
            ) : (
              <div className="relative pl-4 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                {activities.slice(0, 5).map((log) => {
                  const time = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  const date = new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
                  return (
                    <div key={log.id} className="relative text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-[18.5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-primary shadow-sm" />
                      <div className="font-semibold text-foreground">
                        {log.userName}{' '}
                        <span className="font-normal text-muted-foreground">
                          {log.action} {log.entityType}
                        </span>{' '}
                        <span className="text-primary font-medium">{log.entityName}</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        {date} at {time}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
