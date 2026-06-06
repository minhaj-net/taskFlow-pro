'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import {
  ArrowRight, Play, CheckCircle2, Star, Users,
  FolderKanban, TrendingUp, Bell, MoreHorizontal,
  Circle, ChevronRight, Zap, BarChart3, ClipboardList, Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { ROLE_DASHBOARD } from '@/types'

// ── Animation variants ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: (delay = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ── KPI cards data ────────────────────────────────────────────
const kpiCards = [
  { label: 'Total Projects',    value: '1,250+',  color: '#4F46E5', icon: FolderKanban  },
  { label: 'Tasks Completed',   value: '48,000+', color: '#22C55E', icon: CheckCircle2  },
  { label: 'Team Members',      value: '15,000+', color: '#3B82F6', icon: Users         },
  { label: 'Success Rate',      value: '98%',     color: '#F59E0B', icon: TrendingUp    },
]

// ── Dashboard mock data ───────────────────────────────────────
const projects = [
  { name: 'Website Redesign', progress: 72, status: 'On Track',   color: '#22C55E' },
  { name: 'Mobile App v2',    progress: 48, status: 'In Progress', color: '#3B82F6' },
  { name: 'API Integration',  progress: 91, status: 'Near Done',  color: '#4F46E5' },
]
const tasks = [
  { name: 'Design system audit', assignee: 'AM', status: 'Done',    statusColor: '#22C55E' },
  { name: 'Backend refactor',    assignee: 'JK', status: 'Active',  statusColor: '#3B82F6' },
  { name: 'Write unit tests',    assignee: 'SR', status: 'Pending', statusColor: '#F59E0B' },
]
const analyticsCards = [
  { label: 'Total Tasks',  value: '1,284', delta: '+12%', up: true  },
  { label: 'Completed',    value: '948',   delta: '+8%',  up: true  },
  { label: 'In Progress',  value: '236',   delta: '-3%',  up: false },
  { label: 'Overdue',      value: '100',   delta: '+2%',  up: false },
]
const avatarColors = ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#3B82F6']

// ── Dashboard Mockup ──────────────────────────────────────────
function DashboardMockup() {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-border bg-background shadow-2xl shadow-black/10 dark:shadow-black/50"
      aria-hidden="true"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-card">
        <span className="h-3 w-3 rounded-full bg-danger" />
        <span className="h-3 w-3 rounded-full bg-warning" />
        <span className="h-3 w-3 rounded-full bg-success" />
        <div className="ml-4 flex-1 h-5 rounded-md bg-muted max-w-[180px]" />
      </div>

      <div className="flex" style={{ minHeight: 420 }}>
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-[52px] md:w-[140px] shrink-0 border-r border-border bg-card py-4 gap-1">
          <div className="flex items-center gap-2 px-3 mb-4">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center">
              <Zap size={12} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="hidden md:block text-[11px] font-bold text-foreground truncate">TaskFlow</span>
          </div>
          {[
            { icon: BarChart3,    label: 'Dashboard', active: true  },
            { icon: FolderKanban, label: 'Projects'               },
            { icon: ClipboardList,label: 'Tasks'                  },
            { icon: Users,        label: 'Team'                   },
            { icon: Activity,     label: 'Activity'               },
            { icon: Bell,         label: 'Alerts'                 },
          ].map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={cn(
                'flex items-center gap-2 px-3 py-2 mx-2 rounded-lg cursor-default',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground',
              )}
            >
              <Icon size={14} />
              <span className="hidden md:block text-[10px] font-medium truncate">{label}</span>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-hidden p-3 flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-24 rounded bg-foreground/10 mb-1" />
              <div className="h-2 w-16 rounded bg-muted-foreground/20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-tf-indigo" />
              <Bell size={13} className="text-muted-foreground" />
            </div>
          </div>

          {/* Analytics cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {analyticsCards.map((card) => (
              <div key={card.label} className="rounded-xl bg-card border border-border p-2.5">
                <div className="text-[9px] text-muted-foreground mb-0.5 truncate">{card.label}</div>
                <div className="text-sm font-bold text-foreground">{card.value}</div>
                <div className={cn('text-[9px] font-medium', card.up ? 'text-success' : 'text-danger')}>
                  {card.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Projects + chart */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 flex-1">
            <div className="md:col-span-3 rounded-xl bg-card border border-border p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-foreground">Projects</span>
                <MoreHorizontal size={12} className="text-muted-foreground" />
              </div>
              <div className="space-y-2.5">
                {projects.map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] text-foreground truncate max-w-[120px]">{p.name}</span>
                      <span className="text-[8px] font-medium" style={{ color: p.color }}>{p.status}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div className="h-1.5 rounded-full" style={{ width: `${p.progress}%`, backgroundColor: p.color }} />
                    </div>
                    <div className="text-[8px] text-muted-foreground mt-0.5">{p.progress}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="md:col-span-2 rounded-xl bg-card border border-border p-3 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-foreground">Velocity</span>
                <TrendingUp size={11} className="text-success" />
              </div>
              <div className="flex-1 flex items-end gap-1 px-1">
                {[40, 65, 52, 80, 68, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm"
                    style={{
                      height: `${h * 0.55}px`,
                      background: i === 5
                        ? 'linear-gradient(180deg,rgb(var(--tf-emerald)),rgb(var(--tf-indigo)))'
                        : 'rgb(var(--border))',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Task table */}
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
              <span className="text-[10px] font-semibold text-foreground">Recent Tasks</span>
              <ChevronRight size={11} className="text-muted-foreground" />
            </div>
            {tasks.map((t, i) => (
              <div
                key={t.name}
                className={cn('flex items-center gap-2 px-3 py-2', i < tasks.length - 1 && 'border-b border-border')}
              >
                <Circle size={8} className="text-border shrink-0" />
                <span className="flex-1 text-[9px] text-foreground truncate">{t.name}</span>
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0"
                  style={{ backgroundColor: avatarColors[i % avatarColors.length] }}
                >
                  {t.assignee}
                </div>
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                  style={{ backgroundColor: t.statusColor + '20', color: t.statusColor }}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── KPI Floating Card ─────────────────────────────────────────
function KpiCard({ label, value, color, icon: Icon, delay }: {
  label: string; value: string; color: string; icon: React.ElementType; delay: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      custom={delay}
      variants={scaleIn}
      whileHover={{ scale: 1.05, y: -4 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl cursor-default select-none',
        'bg-card/90 border border-border backdrop-blur-md',
        'shadow-lg shadow-black/5 dark:shadow-black/30',
      )}
    >
      <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '18' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-base font-bold text-foreground leading-none">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </div>
    </motion.div>
  )
}

// ── Hero Section ──────────────────────────────────────────────
export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const dashboardSpring = useSpring(dashboardY, { stiffness: 80, damping: 20 })

  // Auth state detection
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [dashboardPath, setDashboardPath] = useState('/dashboard')

  useEffect(() => {
    const session = getSession()
    if (session?.user) {
      setIsLoggedIn(true)
      setDashboardPath(ROLE_DASHBOARD[session.user.role] ?? '/dashboard')
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-20 md:pb-32"
      aria-label="Hero section"
    >
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* Glow blobs — using CSS vars so they shift with theme */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full opacity-[0.12] dark:opacity-[0.08] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-[500px] w-[500px] rounded-full opacity-[0.10] dark:opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--primary)),transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ── LEFT — Content ──────────────────────────── */}
          <div className="flex flex-col items-start">
            {/* Badge */}
            <motion.div
              initial="hidden" animate="show" custom={0} variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
            >
              <Zap size={13} className="text-primary" fill="currentColor" />
              <span className="text-xs font-semibold text-primary tracking-wide">Smart Project Collaboration</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial="hidden" animate="show" custom={0.1} variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground mb-6"
            >
              Manage Projects,{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-tf-indigo via-primary to-tf-indigo bg-clip-text text-transparent">
                  Teams & Tasks
                </span>
                <motion.span
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-primary to-tf-indigo origin-left"
                  aria-hidden="true"
                />
              </span>{' '}
              Smarter
            </motion.h1>

            {/* Description */}
            <motion.p
              initial="hidden" animate="show" custom={0.2} variants={fadeUp}
              className="text-lg leading-relaxed text-muted-foreground mb-8 max-w-[480px]"
            >
              A complete project collaboration platform for teams to manage projects, assign tasks, track progress, and improve productivity.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial="hidden" animate="show" custom={0.3} variants={fadeUp}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10 w-full sm:w-auto"
            >
              <Link
                href={isLoggedIn ? dashboardPath : '/register'}
                className={cn(
                  'group inline-flex items-center gap-2 px-6 py-3 rounded-xl',
                  'text-sm font-semibold text-primary-foreground',
                  'bg-gradient-to-r from-primary to-tf-indigo',
                  'shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40',
                  'hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'w-full sm:w-auto justify-center',
                )}
              >
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/login"
                className={cn(
                  'group inline-flex items-center gap-2 px-6 py-3 rounded-xl',
                  'text-sm font-semibold text-foreground',
                  'border border-border bg-card',
                  'hover:bg-muted hover:border-primary/40',
                  'hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  'w-full sm:w-auto justify-center',
                )}
              >
                <Play size={14} className="text-primary" fill="currentColor" />
                Demo Login
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial="hidden" animate="show" custom={0.4} variants={fadeUp}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <div className="flex items-center gap-1.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={15} className="text-warning fill-warning" />
                ))}
                <span className="ml-1 text-sm font-semibold text-foreground">4.9/5</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" aria-hidden="true" />
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {avatarColors.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: c }}
                    >
                      {['AM','JK','SR','TL'][i]}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Trusted by <strong className="text-foreground">10,000+</strong> Teams
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT — Dashboard ──────────────────────── */}
          <div className="relative">
            <motion.div
              initial="hidden" animate="show" custom={0.25} variants={scaleIn}
              style={{ y: dashboardSpring }}
              className="relative z-10"
            >
              <DashboardMockup />
            </motion.div>

            {/* KPI floating cards */}
            <div className="absolute -left-4 sm:-left-8 top-4 z-20 flex flex-col gap-2">
              {kpiCards.slice(0, 2).map((k, i) => (
                <KpiCard key={k.label} {...k} delay={0.5 + i * 0.1} />
              ))}
            </div>
            <div className="absolute -right-4 sm:-right-8 bottom-4 z-20 flex flex-col gap-2">
              {kpiCards.slice(2).map((k, i) => (
                <KpiCard key={k.label} {...k} delay={0.7 + i * 0.1} />
              ))}
            </div>

            {/* Decorative glow */}
            <div
              className="pointer-events-none absolute -inset-8 rounded-3xl opacity-20 dark:opacity-10"
              style={{ background: 'radial-gradient(ellipse at center,rgb(var(--tf-indigo)),transparent 65%)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
