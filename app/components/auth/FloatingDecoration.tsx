'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2, FolderKanban, Users, TrendingUp,
  BarChart3, Bell, Zap, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Small mock cards that float on the left panel ─────────────

function TaskCard() {
  const tasks = [
    { label: 'Design system audit', done: true  },
    { label: 'API integration',     done: true  },
    { label: 'Write unit tests',    done: false },
    { label: 'Deploy to staging',   done: false },
  ]
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-xl p-4 w-56"
    >
      <div className="flex items-center gap-2 mb-3">
        <FolderKanban size={14} className="text-primary" />
        <span className="text-xs font-semibold text-foreground">Sprint Tasks</span>
        <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/15 text-primary">
          Active
        </span>
      </div>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.label} className="flex items-center gap-2">
            <CheckCircle2
              size={13}
              className={t.done ? 'text-primary' : 'text-muted-foreground/40'}
              fill={t.done ? 'currentColor' : 'none'}
            />
            <span className={cn('text-[11px] truncate', t.done ? 'text-muted-foreground line-through' : 'text-foreground')}>
              {t.label}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function StatsCard() {
  return (
    <motion.div
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-xl p-4 w-48"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-foreground">Team Progress</span>
        <TrendingUp size={13} className="text-success" />
      </div>
      <div className="text-2xl font-extrabold text-foreground mb-1">94%</div>
      <div className="h-1.5 w-full rounded-full bg-muted mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '94%' }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-1.5 rounded-full bg-gradient-to-r from-primary to-tf-indigo"
        />
      </div>
      <div className="text-[10px] text-muted-foreground">
        47 of 50 tasks done
      </div>
    </motion.div>
  )
}

function ActivityCard() {
  const items = [
    { dot: '#10B981', text: 'Task completed', time: '2m ago' },
    { dot: '#4F46E5', text: 'New member added', time: '5m ago' },
    { dot: '#F59E0B', text: 'Deadline updated', time: '12m ago' },
  ]
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="rounded-2xl border border-border bg-card/90 backdrop-blur-sm shadow-xl p-4 w-52"
    >
      <div className="flex items-center gap-2 mb-3">
        <Bell size={13} className="text-primary" />
        <span className="text-xs font-semibold text-foreground">Recent Activity</span>
      </div>
      <ul className="space-y-2">
        {items.map((a) => (
          <li key={a.text} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: a.dot }} />
            <span className="flex-1 text-[11px] text-foreground truncate">{a.text}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function KpiRow() {
  const kpis = [
    { label: 'Projects', value: '24', icon: FolderKanban, color: '#4F46E5' },
    { label: 'Members',  value: '18', icon: Users,        color: '#10B981' },
    { label: 'Done',     value: '486',icon: CheckCircle2, color: '#22C55E' },
  ]
  return (
    <motion.div
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
      className="flex gap-2"
    >
      {kpis.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="flex flex-col items-center gap-1 rounded-xl border border-border bg-card/90 backdrop-blur-sm shadow-lg px-3 py-2.5 min-w-[60px]"
        >
          <Icon size={14} style={{ color }} />
          <span className="text-sm font-bold text-foreground">{value}</span>
          <span className="text-[9px] text-muted-foreground">{label}</span>
        </div>
      ))}
    </motion.div>
  )
}

// ── Main export ───────────────────────────────────────────────
export default function FloatingDecoration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none" aria-hidden="true">
      {/* Layered blur orbs */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%,rgb(var(--tf-emerald)) 0%,transparent 55%), radial-gradient(ellipse at 75% 70%,rgb(var(--tf-indigo)) 0%,transparent 55%)',
        }}
      />
      <div className="absolute top-1/4 -left-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-1/4 -right-8 h-48 w-48 rounded-full bg-tf-indigo/20 blur-3xl" />

      {/* Floating cards — positioned absolutely around center */}
      <div className="relative w-full max-w-sm h-80 mx-auto">
        {/* Task card — top left */}
        <div className="absolute top-0 left-0">
          <TaskCard />
        </div>

        {/* Stats card — center right */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2">
          <StatsCard />
        </div>

        {/* KPI row — bottom left */}
        <div className="absolute bottom-0 left-4">
          <KpiRow />
        </div>

        {/* Activity card — overlapping center */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
          <ActivityCard />
        </div>
      </div>
    </div>
  )
}
