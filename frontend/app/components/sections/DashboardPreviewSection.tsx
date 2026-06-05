'use client'

import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, CheckCircle2, Clock, Users,
  Activity, Zap, MoreHorizontal, ArrowUpRight, Circle,
  FolderKanban, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Shared animation ──────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
})

// ── Mini KPI chip ─────────────────────────────────────────────
function KpiChip({
  label, value, up, color,
}: { label: string; value: string; up: boolean; color: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-xs font-bold text-foreground">{value}</span>
        <ArrowUpRight
          size={11}
          className={up ? 'text-success' : 'rotate-180 text-danger'}
        />
      </div>
    </div>
  )
}

// ── Dashboard card mockup ─────────────────────────────────────
function DashboardCard() {
  const bars = [55, 80, 62, 90, 70, 95, 78]
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden" aria-hidden="true">
      {/* chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-border bg-muted/40">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <div className="ml-3 h-4 w-32 rounded-md bg-border/80" />
      </div>
      <div className="p-4 space-y-4">
        {/* Top KPIs */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Projects', value: '24', color: '#10B981', up: true },
            { label: 'Tasks Done', value: '486', color: '#4F46E5', up: true },
            { label: 'Team Size', value: '18', color: '#3B82F6', up: false },
            { label: 'On-Time %', value: '97%', color: '#F59E0B', up: true },
          ].map((k) => (
            <KpiChip key={k.label} {...k} />
          ))}
        </div>
        {/* Bar chart */}
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-foreground">Weekly Velocity</span>
            <TrendingUp size={12} className="text-primary" />
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all"
                style={{
                  height: `${h}%`,
                  background: i === 5
                    ? 'linear-gradient(180deg,rgb(var(--tf-emerald)),rgb(var(--tf-indigo)))'
                    : 'rgb(var(--border))',
                }}
              />
            ))}
          </div>
        </div>
        {/* Activity feed */}
        <div className="space-y-2">
          {[
            { text: 'Design sprint started', time: '2m ago', dot: '#10B981' },
            { text: 'Task #42 marked done', time: '8m ago', dot: '#4F46E5' },
            { text: 'New member joined', time: '15m ago', dot: '#3B82F6' },
          ].map((a) => (
            <div key={a.text} className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: a.dot }} />
              <span className="flex-1 text-[11px] text-foreground truncate">{a.text}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Analytics card mockup ─────────────────────────────────────
function AnalyticsCard() {
  const ringPct = 78
  const r = 28
  const circ = 2 * Math.PI * r
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden" aria-hidden="true">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground">Team Performance</span>
          <BarChart3 size={14} className="text-muted-foreground" />
        </div>
        {/* Ring chart */}
        <div className="flex items-center gap-4">
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r={r} fill="none" strokeWidth="8" className="stroke-muted" />
            <circle
              cx="36" cy="36" r={r} fill="none" strokeWidth="8"
              stroke="rgb(var(--tf-emerald))"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - ringPct / 100)}
              transform="rotate(-90 36 36)"
            />
            <text x="36" y="40" textAnchor="middle" fontSize="13" fontWeight="700" fill="rgb(var(--foreground))">{ringPct}%</text>
          </svg>
          <div className="space-y-1.5 flex-1">
            {[
              { label: 'Completed', pct: 78, color: '#10B981' },
              { label: 'In Progress', pct: 15, color: '#4F46E5' },
              { label: 'Overdue', pct: 7, color: '#EF4444' },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold text-foreground">{s.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Productivity row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Avg Speed', val: '2.4d' },
            { label: 'Blockers', val: '3' },
            { label: 'Score', val: '94' },
          ].map((m) => (
            <div key={m.label} className="rounded-lg bg-muted/60 p-2 text-center">
              <div className="text-xs font-bold text-foreground">{m.val}</div>
              <div className="text-[9px] text-muted-foreground">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Project tracking card mockup ──────────────────────────────
function ProjectCard() {
  const projects = [
    { name: 'Website Redesign', prog: 72, status: 'On Track', color: '#22C55E', tasks: 24 },
    { name: 'Mobile App v2', prog: 48, status: 'At Risk', color: '#F59E0B', tasks: 38 },
    { name: 'API Integration', prog: 91, status: 'Near Done', color: '#4F46E5', tasks: 16 },
    { name: 'Data Migration', prog: 33, status: 'Delayed', color: '#EF4444', tasks: 52 },
  ]
  return (
    <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden" aria-hidden="true">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="text-xs font-semibold text-foreground">Project Tracking</span>
        <ChevronRight size={13} className="text-muted-foreground" />
      </div>
      <div className="p-3 space-y-3">
        {projects.map((p) => (
          <div key={p.name}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-medium text-foreground truncate max-w-[140px]">{p.name}</span>
              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: p.color + '20', color: p.color }}>
                {p.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-muted">
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${p.prog}%`, backgroundColor: p.color }} />
              </div>
              <span className="text-[10px] font-bold shrink-0" style={{ color: p.color }}>{p.prog}%</span>
            </div>
            <div className="mt-0.5 text-[9px] text-muted-foreground">{p.tasks} tasks</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Preview tab pill ──────────────────────────────────────────
const previewTabs = ['Dashboard', 'Analytics', 'Projects'] as const
type Tab = typeof previewTabs[number]

// ── Section ───────────────────────────────────────────────────
export default function DashboardPreviewSection() {
  return (
    <section
      className="relative py-20 md:py-32 bg-background overflow-hidden"
      aria-labelledby="preview-heading"
    >
      {/* Separators */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      {/* Bg glow */}
      <div
        className="pointer-events-none absolute -right-60 top-0 h-[600px] w-[600px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-60 bottom-0 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div>
            <motion.p {...fadeUp(0)} className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
              Product Preview
            </motion.p>
            <motion.h2
              {...fadeUp(0.08)}
              id="preview-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5"
            >
              See{' '}
              <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
                TaskFlow Pro
              </span>{' '}
              In Action
            </motion.h2>
            <motion.p {...fadeUp(0.16)} className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Get a complete overview of projects, tasks, team performance, and productivity from a single, beautiful dashboard.
            </motion.p>

            {/* Feature bullets */}
            <motion.ul
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
              className="space-y-3 mb-10"
            >
              {[
                { icon: BarChart3, text: 'Real-time analytics & velocity charts' },
                { icon: FolderKanban, text: 'Visual project & sprint tracking' },
                { icon: Users, text: 'Team productivity & workload view' },
                { icon: Activity, text: 'Live activity feed & audit trail' },
              ].map(({ icon: Icon, text }) => (
                <motion.li
                  key={text}
                  variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                  className="flex items-center gap-3"
                >
                  <span className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-primary" />
                  </span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3">
              <a
                href="/signup"
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground',
                  'bg-gradient-to-r from-primary to-tf-emerald',
                  'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35',
                  'hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                Try It Free
                <ArrowUpRight size={15} />
              </a>
              <a
                href="/demo"
                className={cn(
                  'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold',
                  'text-foreground border border-border bg-card',
                  'hover:bg-muted hover:border-primary/40',
                  'hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                Watch Demo
              </a>
            </motion.div>
          </div>

          {/* Right — stacked mockup cards */}
          <div className="relative">
            {/* Card stack with depth */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <DashboardCard />
            </motion.div>

            {/* Analytics card — peeking below-right */}
            <motion.div
              initial={{ opacity: 0, x: 40, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -right-4 sm:-right-10 z-20 w-[220px] sm:w-[260px]"
            >
              <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ duration: 0.25 }}>
                <AnalyticsCard />
              </motion.div>
            </motion.div>

            {/* Project card — peeking top-left */}
            <motion.div
              initial={{ opacity: 0, x: -40, y: -20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -top-6 -left-4 sm:-left-10 z-20 w-[200px] sm:w-[240px]"
            >
              <motion.div whileHover={{ scale: 1.03, y: -4 }} transition={{ duration: 0.25 }}>
                <ProjectCard />
              </motion.div>
            </motion.div>

            {/* Glow ring */}
            <div
              className="pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-20 blur-2xl"
              style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-emerald)),transparent 60%)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
