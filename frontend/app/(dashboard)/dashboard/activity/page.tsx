'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  History, RefreshCw, Calendar, User,
  Shield, Briefcase, Users, Search,
  Filter, Trash2, ChevronRight,
  FolderKanban, CheckSquare, UserCheck,
  Zap, TrendingUp, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import {
  useActivities,
  useActivitiesByRole,
  useDeleteActivity,
} from '@/hooks/use-activities'
import type { User as UserType, Role, ActivityLog } from '@/types'

// ── Tab config ────────────────────────────────────────────────
const TABS: { id: 'all' | Role; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'all',     label: 'All Activity', icon: History,    color: 'text-primary'        },
  { id: 'admin',   label: 'Admin',        icon: Shield,     color: 'text-danger'         },
  { id: 'manager', label: 'Manager',      icon: Briefcase,  color: 'text-warning'        },
  { id: 'member',  label: 'Member',       icon: Users,      color: 'text-info'           },
]

// ── Action color & icon ───────────────────────────────────────
const ACTION_STYLE: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  created:   { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: Zap          },
  updated:   { bg: 'bg-blue-500/10',    text: 'text-blue-500',    icon: TrendingUp   },
  deleted:   { bg: 'bg-red-500/10',     text: 'text-red-500',     icon: Trash2       },
  completed: { bg: 'bg-purple-500/10',  text: 'text-purple-500',  icon: CheckSquare  },
  started:   { bg: 'bg-orange-500/10',  text: 'text-orange-500',  icon: Clock        },
  assigned:  { bg: 'bg-cyan-500/10',    text: 'text-cyan-500',    icon: UserCheck    },
  added:     { bg: 'bg-teal-500/10',    text: 'text-teal-500',    icon: UserCheck    },
}

const ENTITY_ICON: Record<string, React.ElementType> = {
  project: FolderKanban,
  task:    CheckSquare,
  member:  UserCheck,
}

// ── Role badge ────────────────────────────────────────────────
function RoleBadge({ role }: { role: string }) {
  return (
    <span className={cn(
      'text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider',
      role === 'admin'   && 'bg-danger/10 text-danger',
      role === 'manager' && 'bg-warning/10 text-warning',
      role === 'member'  && 'bg-info/10 text-info',
    )}>
      {role}
    </span>
  )
}

// ── Single activity card ──────────────────────────────────────
function ActivityCard({
  log, idx, canDelete, onDelete,
}: {
  log: ActivityLog; idx: number; canDelete: boolean; onDelete: (id: string) => void
}) {
  const style      = ACTION_STYLE[log.action] ?? ACTION_STYLE.updated
  const ActionIcon = style.icon
  const EntityIcon = ENTITY_ICON[log.entityType] ?? FolderKanban
  const date = new Date(log.timestamp)
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.025, duration: 0.2 }}
      className="relative pl-10"
    >
      {/* Timeline dot */}
      <span className={cn(
        'absolute left-0 top-3 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ring-4 ring-card',
        style.bg,
      )}>
        <ActionIcon size={14} className={style.text} />
      </span>

      <div className={cn(
        'group rounded-2xl border border-border/60 bg-card p-4 shadow-sm',
        'hover:shadow-md hover:border-border transition-all duration-200',
      )}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">

          {/* Left: who + what */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <User size={12} className="text-muted-foreground shrink-0" />
                {log.userName}
              </span>
              <RoleBadge role={(log as any).userRole ?? 'member'} />
              <span className={cn(
                'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                style.bg, style.text,
              )}>
                {log.action}
              </span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className={cn('inline-flex items-center gap-1 font-semibold text-foreground mr-1')}>
                <EntityIcon size={11} />
                {log.entityType}
              </span>
              &rarr;{' '}
              <span className="font-bold text-foreground">{log.entityName}</span>
            </p>
          </div>

          {/* Right: time + delete */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
              <Calendar size={11} />
              {dateStr} · {timeStr}
            </span>
            {canDelete && (
              <button
                onClick={() => onDelete(log.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-all"
                title="Delete log"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Stats bar ─────────────────────────────────────────────────
function StatsBar({ logs }: { logs: ActivityLog[] }) {
  const counts = logs.reduce((acc, l) => {
    acc[l.action] = (acc[l.action] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  const items = [
    { label: 'Created',  count: counts.created  ?? 0, color: 'text-emerald-500' },
    { label: 'Updated',  count: counts.updated  ?? 0, color: 'text-blue-500'    },
    { label: 'Deleted',  count: counts.deleted  ?? 0, color: 'text-red-500'     },
    { label: 'Completed',count: counts.completed?? 0, color: 'text-purple-500'  },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label}
          className="bg-card border border-border rounded-2xl p-4 text-center shadow-sm">
          <div className={cn('text-2xl font-extrabold', item.color)}>{item.count}</div>
          <div className="text-[11px] text-muted-foreground mt-0.5 uppercase tracking-wide font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────
export default function ActivityPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [activeTab,   setActiveTab]   = useState<'all' | Role>('all')
  const [search,      setSearch]      = useState('')
  const [entityFilter,setEntityFilter]= useState('all')

  useEffect(() => {
    const session = getSession()
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
      router.replace('/dashboard/dashboard')
      return
    }
    setCurrentUser(session.user)
  }, [router])

  const { data: allLogs     = [], isLoading: loadingAll,     refetch: refetchAll     } = useActivities(200)
  const { data: adminLogs   = [], isLoading: loadingAdmin,   refetch: refetchAdmin   } = useActivitiesByRole('admin')
  const { data: managerLogs = [], isLoading: loadingManager, refetch: refetchManager } = useActivitiesByRole('manager')
  const { data: memberLogs  = [], isLoading: loadingMember,  refetch: refetchMember  } = useActivitiesByRole('member')
  const deleteMutation = useDeleteActivity()

  if (!currentUser) return null

  const isAdmin = currentUser.role === 'admin'

  const RAW_LOGS: Record<string, ActivityLog[]> = {
    all:     allLogs,
    admin:   adminLogs,
    manager: managerLogs,
    member:  memberLogs,
  }

  const isLoading = loadingAll || loadingAdmin || loadingManager || loadingMember

  // ── Filter logs ─────────────────────────────────────────────
  const activeLogs = (RAW_LOGS[activeTab] ?? []).filter((log) => {
    const matchSearch =
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.entityName.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase())
    const matchEntity = entityFilter === 'all' || log.entityType === entityFilter
    return matchSearch && matchEntity
  })

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
    refetchAll(); refetchAdmin(); refetchManager(); refetchMember()
  }

  const refetchAll2 = () => {
    refetchAll(); refetchAdmin(); refetchManager(); refetchMember()
  }

  return (
    <div className="space-y-6">

      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <History className="h-8 w-8 text-primary" />
            Activity Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete audit trail — view every action by role, entity, or user.
          </p>
        </div>
        <button
          onClick={refetchAll2}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-sm"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────── */}
      <StatsBar logs={allLogs} />

      {/* ── Role Tabs ────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-0">
        {TABS.map((tab) => {
          const Icon  = tab.icon
          const count = RAW_LOGS[tab.id]?.length ?? 0
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all border-b-2 -mb-px',
                isActive
                  ? `border-primary bg-card ${tab.color}`
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
              )}
            >
              <Icon size={15} />
              {tab.label}
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
              )}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* ── Filters ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, entity, or action…"
            className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm">
          <Filter size={13} />
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="bg-transparent border-none text-foreground outline-none text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="project">Projects</option>
            <option value="task">Tasks</option>
            <option value="member">Members</option>
          </select>
        </div>
      </div>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <RefreshCw className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : activeLogs.length === 0 ? (
          <div className="text-center py-16">
            <History className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-semibold text-foreground">No activity found</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search || entityFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Actions will appear here as users interact with the system.'}
            </p>
          </div>
        ) : (
          <div className="relative space-y-3 before:absolute before:left-4 before:top-4 before:bottom-4 before:w-px before:bg-border/60">
            <AnimatePresence>
              {activeLogs.map((log, idx) => (
                <ActivityCard
                  key={log.id}
                  log={log}
                  idx={idx}
                  canDelete={isAdmin}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer count */}
      {activeLogs.length > 0 && (
        <p className="text-center text-xs text-muted-foreground pb-2">
          Showing <span className="font-bold text-foreground">{activeLogs.length}</span> {activeTab === 'all' ? 'total' : activeTab} activit{activeLogs.length === 1 ? 'y' : 'ies'}
        </p>
      )}
    </div>
  )
}
