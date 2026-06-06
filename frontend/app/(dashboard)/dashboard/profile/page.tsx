'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Mail, Calendar, Building, Key, Shield,
  CheckSquare, Clock, AlertTriangle, FolderKanban,
  TrendingUp, Zap, Star, Award, Target, BarChart2,
  Users, Lock, Eye, Edit3, Trash2, Plus,
  CheckCircle2, XCircle, Activity, Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useTasks } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import { useUsers } from '@/hooks/use-users'
import { useActivitiesByUser } from '@/hooks/use-activities'
import { useNotifications } from '@/hooks/use-notifications'
import type { User as UserType, Role, RolePermissions, ROLE_PERMISSIONS } from '@/types'
import { ROLE_PERMISSIONS as PERMS } from '@/types'

// ── Role config ───────────────────────────────────────────────
const ROLE_META: Record<Role, {
  gradient: string
  badge: string
  badgeText: string
  tagline: string
  accentBg: string
  accentText: string
}> = {
  admin: {
    gradient:   'from-red-500 to-rose-600',
    badge:      'bg-red-500/10 text-red-500 border border-red-500/20',
    badgeText:  'bg-red-500',
    tagline:    'Full system access — manage users, projects, tasks, and platform settings.',
    accentBg:   'bg-red-500/10',
    accentText: 'text-red-500',
  },
  manager: {
    gradient:   'from-amber-500 to-orange-500',
    badge:      'bg-amber-500/10 text-amber-600 border border-amber-500/20',
    badgeText:  'bg-amber-500',
    tagline:    'Oversee projects and teams — create tasks, manage members, and track progress.',
    accentBg:   'bg-amber-500/10',
    accentText: 'text-amber-600',
  },
  member: {
    gradient:   'from-blue-500 to-indigo-600',
    badge:      'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    badgeText:  'bg-blue-500',
    tagline:    'Collaborate on projects — complete assigned tasks and stay on top of deadlines.',
    accentBg:   'bg-blue-500/10',
    accentText: 'text-blue-500',
  },
}

// ── Permission row ────────────────────────────────────────────
function PermRow({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
      <span className="text-xs text-foreground font-medium">{label}</span>
      {allowed
        ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500"><CheckCircle2 size={13} /> Allowed</span>
        : <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground"><XCircle size={13} /> Restricted</span>
      }
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, bg, color }: {
  icon: React.ElementType; label: string; value: number | string
  sub?: string; bg: string; color: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('rounded-2xl border border-border p-4 shadow-sm space-y-2', bg)}
    >
      <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center', bg)}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <div className={cn('text-2xl font-extrabold', color)}>{value}</div>
        <div className="text-xs font-semibold text-foreground">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
    </motion.div>
  )
}

export default function ProfilePage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: tasks    = [] } = useTasks()
  const { data: projects = [] } = useProjects()
  const { data: users    = [] } = useUsers()
  const { data: myLogs   = [] } = useActivitiesByUser(currentUser?.id ?? '', 10)
  const { data: notifs   = [] } = useNotifications(currentUser?.id)

  if (!currentUser) return null

  const role     = currentUser.role
  const meta     = ROLE_META[role]
  const perms    = PERMS[role]
  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  // ── Computed stats ───────────────────────────────────────────
  const myTasks        = tasks.filter(t => t.assigneeId === currentUser.id)
  const completedTasks = myTasks.filter(t => t.status === 'completed')
  const pendingTasks   = myTasks.filter(t => t.status !== 'completed')
  const overdueTasks   = myTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date())
  const inProgressTasks = myTasks.filter(t => t.status === 'in-progress')
  const productivity   = myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0

  const myProjects     = projects.filter(p => p.memberIds.includes(currentUser.id))
  const activeProjects = myProjects.filter(p => p.status === 'active')
  const doneProjects   = myProjects.filter(p => p.status === 'completed')

  const unreadNotifs   = notifs.filter(n => !n.read).length

  // Admin/manager specific
  const totalUsers    = users.length
  const activeMembers = users.filter(u => u.isActive).length
  const totalProjects = projects.length
  const totalTasks    = tasks.length

  // Recent tasks (last 5)
  const recentTasks = myTasks.slice(0, 5)

  return (
    <div className="space-y-6">

      {/* ── Hero banner ─────────────────────────────────────── */}
      <div className={cn(
        'relative overflow-hidden rounded-3xl bg-gradient-to-br p-6 sm:p-8 text-white shadow-xl',
        meta.gradient,
      )}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-8 -right-8 h-48 w-48 rounded-full bg-white" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white" />
        </div>

        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center font-extrabold text-2xl text-white shadow-xl shrink-0">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{currentUser.name}</h1>
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                {role}
              </span>
            </div>
            <p className="text-white/80 text-sm">{currentUser.email}</p>
            <p className="text-white/70 text-xs mt-2 max-w-xl">{meta.tagline}</p>
          </div>

          {/* Quick stats chips */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
              <div className="text-xl font-extrabold">{myTasks.length}</div>
              <div className="text-[10px] text-white/80 uppercase">Tasks</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
              <div className="text-xl font-extrabold">{myProjects.length}</div>
              <div className="text-[10px] text-white/80 uppercase">Projects</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-2 text-center">
              <div className="text-xl font-extrabold">{productivity}%</div>
              <div className="text-[10px] text-white/80 uppercase">Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN ── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Account info card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-0 divide-y divide-border/60">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider pb-3">Account Details</h3>
            {[
              { icon: Mail,     label: 'Email',      value: currentUser.email                   },
              { icon: Building, label: 'Department',  value: currentUser.department || 'Not set' },
              { icon: Calendar, label: 'Joined',      value: new Date(currentUser.joinedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) },
              { icon: Shield,   label: 'Role',        value: currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1) },
              { icon: Key,      label: 'Session',     value: 'Active & Secure'                  },
              { icon: Bell,     label: 'Unread Notifs', value: `${unreadNotifs} unread`          },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 py-3">
                <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', meta.accentBg)}>
                  <Icon size={14} className={meta.accentText} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-muted-foreground uppercase font-medium">{label}</div>
                  <div className="text-sm font-semibold text-foreground truncate">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Permissions card */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
              <Lock size={12} className={meta.accentText} /> Role Permissions
            </h3>
            <PermRow label="Create Projects"   allowed={perms.canCreateProject}   />
            <PermRow label="Edit Projects"     allowed={perms.canEditProject}     />
            <PermRow label="Delete Projects"   allowed={perms.canDeleteProject}   />
            <PermRow label="Create Tasks"      allowed={perms.canCreateTask}      />
            <PermRow label="Edit Tasks"        allowed={perms.canEditTask}        />
            <PermRow label="Delete Tasks"      allowed={perms.canDeleteTask}      />
            <PermRow label="Manage Users"      allowed={perms.canManageUsers}     />
            <PermRow label="View Analytics"    allowed={perms.canViewAnalytics}   />
            <PermRow label="View All Projects" allowed={perms.canViewAllProjects} />
          </div>
        </div>

        {/* RIGHT COLUMN ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Personal task stats */}
          <div>
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">My Task Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard icon={CheckSquare}  label="Total Tasks"   value={myTasks.length}        bg="bg-card border border-border"    color="text-foreground"     />
              <StatCard icon={CheckCircle2} label="Completed"     value={completedTasks.length} bg="bg-emerald-500/5 border-emerald-500/20" color="text-emerald-500" />
              <StatCard icon={Clock}        label="In Progress"   value={inProgressTasks.length} bg="bg-blue-500/5 border-blue-500/20"     color="text-blue-500"   />
              <StatCard icon={AlertTriangle}label="Overdue"       value={overdueTasks.length}   bg="bg-red-500/5 border-red-500/20"       color="text-red-500"    />
            </div>
          </div>

          {/* Productivity bar */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={12} className={meta.accentText} /> Productivity Rate
              </h3>
              <span className={cn('text-lg font-extrabold', meta.accentText)}>{productivity}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${productivity}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={cn('h-full rounded-full bg-gradient-to-r', meta.gradient)}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground mt-2">
              <span>{completedTasks.length} completed</span>
              <span>{pendingTasks.length} remaining</span>
            </div>
          </div>

          {/* Project involvement */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <FolderKanban size={12} className={meta.accentText} /> Project Involvement
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 rounded-xl bg-muted/30 border border-border/40">
                <div className="text-xl font-extrabold text-foreground">{myProjects.length}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5 uppercase">Total</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <div className="text-xl font-extrabold text-blue-500">{activeProjects.length}</div>
                <div className="text-[10px] text-blue-500/70 mt-0.5 uppercase">Active</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-xl font-extrabold text-emerald-500">{doneProjects.length}</div>
                <div className="text-[10px] text-emerald-500/70 mt-0.5 uppercase">Completed</div>
              </div>
            </div>
            {myProjects.length > 0 && (
              <div className="space-y-2">
                {myProjects.slice(0, 4).map(p => (
                  <a key={p.id} href={`/dashboard/projects/${p.id}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FolderKanban size={13} className={meta.accentText} />
                      <span className="text-xs font-semibold text-foreground truncate">{p.name}</span>
                    </div>
                    <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shrink-0',
                      p.status === 'active'    && 'bg-blue-500/10 text-blue-500',
                      p.status === 'completed' && 'bg-emerald-500/10 text-emerald-500',
                      p.status === 'on-hold'   && 'bg-amber-500/10 text-amber-500',
                    )}>{p.status}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Role-specific section */}
          {role === 'admin' && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Shield size={12} className="text-red-500" /> System Overview (Admin)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Users}       label="Total Users"    value={totalUsers}    sub={`${activeMembers} active`}  bg="bg-red-500/5 border-red-500/20"    color="text-red-500"    />
                <StatCard icon={FolderKanban}label="Total Projects"  value={totalProjects} bg="bg-purple-500/5 border-purple-500/20" color="text-purple-500" />
                <StatCard icon={CheckSquare} label="Total Tasks"    value={totalTasks}    bg="bg-blue-500/5 border-blue-500/20"   color="text-blue-500"   />
                <StatCard icon={Activity}    label="Completed"      value={tasks.filter(t=>t.status==='completed').length} bg="bg-emerald-500/5 border-emerald-500/20" color="text-emerald-500" />
              </div>
            </div>
          )}

          {role === 'manager' && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart2 size={12} className="text-amber-500" /> Team Overview (Manager)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={Users}       label="Team Size"     value={users.filter(u=>u.role==='member').length} bg="bg-amber-500/5 border-amber-500/20" color="text-amber-500" />
                <StatCard icon={FolderKanban}label="My Projects"    value={myProjects.length} bg="bg-orange-500/5 border-orange-500/20" color="text-orange-500" />
                <StatCard icon={CheckSquare} label="Team Tasks"    value={tasks.length} bg="bg-blue-500/5 border-blue-500/20" color="text-blue-500" />
                <StatCard icon={Target}      label="Completion"    value={`${tasks.length > 0 ? Math.round((tasks.filter(t=>t.status==='completed').length/tasks.length)*100) : 0}%`} bg="bg-emerald-500/5 border-emerald-500/20" color="text-emerald-500" />
              </div>
            </div>
          )}

          {role === 'member' && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Star size={12} className="text-blue-500" /> My Recent Tasks
              </h3>
              {recentTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No tasks assigned yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentTasks.map(t => (
                    <a key={t.id} href={`/dashboard/tasks/${t.id}`}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/60 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CheckSquare size={13} className="text-blue-500 shrink-0" />
                        <span className={cn('text-xs font-semibold truncate',
                          t.status === 'completed' && 'line-through text-muted-foreground'
                        )}>{t.title}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full uppercase',
                          t.priority === 'high'   && 'bg-red-500/10 text-red-500',
                          t.priority === 'medium' && 'bg-amber-500/10 text-amber-500',
                          t.priority === 'low'    && 'bg-blue-500/10 text-blue-500',
                        )}>{t.priority}</span>
                        <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full uppercase',
                          t.status === 'completed'  && 'bg-emerald-500/10 text-emerald-500',
                          t.status === 'in-progress'&& 'bg-blue-500/10 text-blue-500',
                          t.status === 'todo'       && 'bg-muted text-muted-foreground',
                        )}>{t.status}</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent activity */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity size={12} className={meta.accentText} /> Recent Activity
            </h3>
            {myLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No recent activity recorded.</p>
            ) : (
              <div className="space-y-3">
                {myLogs.slice(0, 6).map((log, i) => (
                  <motion.div key={log.id}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-3">
                    <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5', meta.accentBg)}>
                      <Zap size={12} className={meta.accentText} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-foreground">
                        <span className="font-bold capitalize">{log.action}</span>
                        {' '}<span className="text-muted-foreground">{log.entityType}</span>
                        {' '}→ <span className="font-semibold">{log.entityName}</span>
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
