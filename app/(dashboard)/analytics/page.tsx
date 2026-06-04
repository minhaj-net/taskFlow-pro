'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  BarChart3, RefreshCw, Activity, Calendar, PieChart as PieIcon, TrendingUp, AlertTriangle
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import type { User } from '@/types'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area,
  LineChart, Line
} from 'recharts'

export default function AnalyticsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const session = getSession()
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
      router.replace('/dashboard/dashboard')
      return
    }
    setCurrentUser(session.user)
  }, [router])

  const { data: projects = [], isLoading: loadingProjects } = useProjects()
  const { data: tasks = [], isLoading: loadingTasks } = useTasks()
  const { data: users = [], isLoading: loadingUsers } = useUsers()

  if (!currentUser) return null

  if (loadingProjects || loadingTasks || loadingUsers) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── Stats calculation ────────────────────────────────────────
  const totalTasks = tasks.length
  const completed = tasks.filter(t => t.status === 'completed').length
  const inProgress = tasks.filter(t => t.status === 'in-progress').length
  const todo = tasks.filter(t => t.status === 'todo').length

  const lowPriority = tasks.filter(t => t.priority === 'low').length
  const medPriority = tasks.filter(t => t.priority === 'medium').length
  const highPriority = tasks.filter(t => t.priority === 'high').length

  // 1. Task Status Pie
  const statusPieData = [
    { name: 'Completed', value: completed, color: '#10b981' },
    { name: 'In Progress', value: inProgress, color: '#6366f1' },
    { name: 'To Do', value: todo, color: '#94a3b8' },
  ].filter(d => d.value > 0)

  // 2. Priority Bar Chart
  const priorityBarData = [
    { name: 'Low Priority', count: lowPriority, color: '#3b82f6' },
    { name: 'Medium Priority', count: medPriority, color: '#f59e0b' },
    { name: 'High Priority', count: highPriority, color: '#ef4444' },
  ]

  // 3. Department productivity (tasks per department)
  const deptData = users.map((u) => {
    const userTasks = tasks.filter(t => t.assigneeId === u.id)
    return {
      name: u.name.split(' ')[0],
      department: u.department,
      total: userTasks.length,
      completed: userTasks.filter(t => t.status === 'completed').length,
    }
  })

  // Group by department
  const deptMap: Record<string, { total: number; completed: number }> = {}
  users.forEach((u) => {
    const userTasks = tasks.filter(t => t.assigneeId === u.id)
    if (!deptMap[u.department]) {
      deptMap[u.department] = { total: 0, completed: 0 }
    }
    deptMap[u.department].total += userTasks.length
    deptMap[u.department].completed += userTasks.filter(t => t.status === 'completed').length
  })

  const deptChartData = Object.keys(deptMap).map((dept) => ({
    name: dept,
    Total: deptMap[dept].total,
    Completed: deptMap[dept].completed,
  }))

  // 4. Project Progress Timeline
  const projectTimelineData = projects.map((p) => {
    const projTasks = tasks.filter(t => t.projectId === p.id)
    const total = projTasks.length
    const comp = projTasks.filter(t => t.status === 'completed').length
    const rate = total > 0 ? Math.round((comp / total) * 100) : 0
    return {
      name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
      Progress: rate,
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-primary" />
          Analytics & Performance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed metrics, charts, and team productivity trends.
        </p>
      </div>

      {/* Grid of Analytics widgets */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Task Status Distribution */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <PieIcon size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Task Status Distribution</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {isClient && statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
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
              <div className="text-xs text-muted-foreground">No tasks inside system.</div>
            )}
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <AlertTriangle size={16} className="text-amber" />
            <h2 className="text-sm font-bold text-foreground">Tasks by Priority</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {isClient && totalTasks > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                    {priorityBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No tasks inside system.</div>
            )}
          </div>
        </div>

        {/* Department Productivity */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <TrendingUp size={16} className="text-emerald" />
            <h2 className="text-sm font-bold text-foreground">Department Productivity</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {isClient && deptChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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
                  <Legend />
                  <Bar dataKey="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No department data.</div>
            )}
          </div>
        </div>

        {/* Project Completion Progress */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Activity size={16} className="text-indigo-500" />
            <h2 className="text-sm font-bold text-foreground">Project Completion Progress (%)</h2>
          </div>
          <div className="h-64 flex items-center justify-center">
            {isClient && projectTimelineData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectTimelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} unit="%" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Area type="monotone" dataKey="Progress" stroke="#6366f1" fillOpacity={1} fill="url(#colorProgress)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-muted-foreground">No projects inside system.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
