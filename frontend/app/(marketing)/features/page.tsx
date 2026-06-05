'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FolderKanban, CheckSquare, Users, BarChart3, History, Bell,
  ShieldCheck, Zap, ArrowRight, Check, Star, Layers,
  GitBranch, Clock, MessageSquare, PieChart, Lock,
  RefreshCw, Globe, Smartphone, Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Shared animation helpers ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
}
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}
const cardIn = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// ─────────────────────────────────────────────────────────────
// SECTION 1 — Hero Banner
// ─────────────────────────────────────────────────────────────
function FeatureHero() {
  return (
    <section className="relative py-24 md:py-36 bg-background overflow-hidden">
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }}
        aria-hidden="true"
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[700px] w-[700px] rounded-full opacity-[0.10] dark:opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[500px] w-[500px] rounded-full opacity-[0.08] dark:opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
          <Zap size={13} className="text-primary" fill="currentColor" />
          <span className="text-xs font-semibold text-primary tracking-wide">Platform Features</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial="hidden" animate="show" custom={0.1} variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
          Built for{' '}
          <span className="bg-gradient-to-r from-tf-indigo via-primary to-tf-indigo bg-clip-text text-transparent">
            Modern Teams
          </span>
          {' '}That Ship
        </motion.h1>

        {/* Subtext */}
        <motion.p initial="hidden" animate="show" custom={0.2} variants={fadeUp}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          TaskFlow Pro brings together project management, task tracking, team collaboration, and analytics in one beautifully designed platform.
        </motion.p>

        {/* CTAs */}
        <motion.div initial="hidden" animate="show" custom={0.3} variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Get Started Free
            <ArrowRight size={15} />
          </Link>
          <Link href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-foreground border border-border bg-card hover:bg-muted hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            See Live Demo
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div initial="hidden" animate="show" custom={0.4} variants={fadeUp}
          className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '10K+', label: 'Teams' },
            { value: '98%',  label: 'Satisfaction' },
            { value: '48K+', label: 'Tasks Done' },
            { value: '4.9',  label: 'Rating' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-foreground mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — Core Feature Cards Grid
// ─────────────────────────────────────────────────────────────
const coreFeatures = [
  {
    icon: FolderKanban, color: '#4F46E5', badge: 'Core',
    title: 'Project Management',
    desc: 'Create projects with boards, timelines, and milestone tracking. Manage every detail from kickoff to delivery.',
    bullets: ['Kanban & list views', 'Deadline tracking', 'Project templates', 'File attachments'],
  },
  {
    icon: CheckSquare, color: '#10B981', badge: 'Popular',
    title: 'Task Management',
    desc: 'Break work into tasks, assign priorities, set due dates, and track completion across your whole team.',
    bullets: ['Priority levels', 'Status workflows', 'Bulk actions', 'Recurring tasks'],
  },
  {
    icon: Users, color: '#3B82F6',
    title: 'Team Collaboration',
    desc: 'Work together in real time with inline comments, @mentions, shared workspaces and role-based access.',
    bullets: ['Inline comments', '@mentions', 'Role-based access', 'Activity feeds'],
  },
  {
    icon: BarChart3, color: '#F59E0B', badge: 'New',
    title: 'Analytics & Reports',
    desc: 'Beautiful, interactive charts that give you instant visibility into team velocity and project health.',
    bullets: ['Velocity charts', 'Priority heatmap', 'Completion trends', 'Export to CSV'],
  },
  {
    icon: Bell, color: '#EF4444',
    title: 'Smart Notifications',
    desc: 'Stay in the loop with contextual alerts for deadlines, assignments, and status changes — when you need them.',
    bullets: ['In-app alerts', 'Deadline reminders', 'Custom rules', 'Notification centre'],
  },
  {
    icon: ShieldCheck, color: '#8B5CF6',
    title: 'RBAC Permissions',
    desc: 'Fine-grained role-based access control ensures the right people see and do the right things.',
    bullets: ['Admin / Manager / Member', 'Page-level guards', 'Secure sessions', 'Audit logs'],
  },
]

function CoreFeaturesSection() {
  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden" aria-labelledby="core-heading">
      {/* Top divider */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      {/* Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Core Capabilities
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="core-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Everything in{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              One Platform
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground leading-relaxed">
            Six powerful modules that work together seamlessly so your team can focus on shipping, not tooling.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {coreFeatures.map((f) => {
            const Icon = f.icon
            return (
              <motion.div key={f.title} variants={cardIn}
                whileHover={{ y: -5, scale: 1.01 }}
                className="group relative flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Top gradient line */}
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg,${f.color}00,${f.color},${f.color}00)` }} aria-hidden="true" />
                {/* Corner glow */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                  style={{ backgroundColor: f.color + '20' }} aria-hidden="true" />

                {/* Badge */}
                {f.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: f.color + '18', color: f.color }}>
                    {f.badge}
                  </span>
                )}

                {/* Icon */}
                <div className="mb-5 h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: f.color + '15' }}>
                  <Icon size={22} style={{ color: f.color }} strokeWidth={2} />
                </div>

                <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{f.desc}</p>

                {/* Bullets */}
                <ul className="space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check size={12} style={{ color: f.color }} className="shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — Feature Deep-dive (alternating layout)
// ─────────────────────────────────────────────────────────────
const deepDives = [
  {
    tag: 'Project Management',
    color: '#4F46E5',
    title: 'From Idea to Delivery — All in One Place',
    desc: 'Create projects in seconds, invite your team, assign roles, and immediately start breaking down work into trackable milestones. Track progress with live completion rates and deadline alerts.',
    points: [
      { icon: GitBranch, text: 'Milestone-based project structure' },
      { icon: Clock,     text: 'Live deadline and overdue tracking' },
      { icon: Users,     text: 'Role-based member assignment' },
      { icon: Layers,    text: 'File attachments per project' },
    ],
    // Visual: mock project card
    visual: (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Website Redesign</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">Active</span>
        </div>
        {[
          { label: 'Design System', pct: 85, color: '#4F46E5' },
          { label: 'Frontend Build', pct: 62, color: '#10B981' },
          { label: 'QA Testing',    pct: 38, color: '#F59E0B' },
        ].map((t) => (
          <div key={t.label}>
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>{t.label}</span><span>{t.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
            </div>
          </div>
        ))}
        <div className="flex -space-x-2 pt-1">
          {['#4F46E5','#10B981','#F59E0B','#EF4444'].map((c, i) => (
            <div key={i} className="h-7 w-7 rounded-full border-2 border-card flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: c }}>
              {['AM','JK','SR','TL'][i]}
            </div>
          ))}
          <div className="h-7 w-7 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">+3</div>
        </div>
      </div>
    ),
  },
  {
    tag: 'Task Tracking',
    color: '#10B981',
    title: 'Track Every Task From Creation to Completion',
    desc: 'Assign tasks to team members, set priorities, filter by project or status, paginate through large lists, and mark tasks done with an instant completion panel — all without leaving the page.',
    points: [
      { icon: CheckSquare, text: 'Priority-based task sorting' },
      { icon: RefreshCw,   text: 'Real-time status updates' },
      { icon: MessageSquare,text: 'Inline comments per task' },
      { icon: Clock,       text: 'Due date overdue alerts' },
    ],
    visual: (
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <span className="text-xs font-bold text-foreground">Task Board</span>
          <span className="text-[10px] text-muted-foreground">8 tasks</span>
        </div>
        {[
          { title: 'Design component library', status: 'completed',   priority: 'high',   color: '#10B981', pcolor: '#EF4444' },
          { title: 'Implement auth flow',       status: 'in-progress', priority: 'high',   color: '#6366F1', pcolor: '#EF4444' },
          { title: 'Write API documentation',   status: 'todo',        priority: 'medium', color: '#94A3B8', pcolor: '#F59E0B' },
          { title: 'Setup CI/CD pipeline',      status: 'todo',        priority: 'low',    color: '#94A3B8', pcolor: '#3B82F6' },
        ].map((t, i) => (
          <div key={t.title} className={cn('flex items-center gap-3 px-4 py-2.5', i < 3 && 'border-b border-border/50')}>
            <div className="h-3.5 w-3.5 rounded-sm border-2 shrink-0 flex items-center justify-center"
              style={{ borderColor: t.color, backgroundColor: t.status === 'completed' ? t.color : 'transparent' }}>
              {t.status === 'completed' && <Check size={8} className="text-white" />}
            </div>
            <span className={cn('flex-1 text-[11px] font-medium truncate', t.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground')}>
              {t.title}
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: t.pcolor + '18', color: t.pcolor }}>
              {t.priority}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    tag: 'Analytics',
    color: '#F59E0B',
    title: 'Data-Driven Decisions With Beautiful Dashboards',
    desc: 'Get a real-time view of your team\'s performance with task distribution, priority breakdowns, department productivity charts, and project completion trends.',
    points: [
      { icon: PieChart,  text: 'Task status pie chart' },
      { icon: BarChart3, text: 'Priority distribution bar chart' },
      { icon: Users,     text: 'Department productivity grouped bars' },
      { icon: Layers,    text: 'Project completion area chart' },
    ],
    visual: (
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
        <div className="text-xs font-bold text-foreground mb-2">Team Productivity</div>
        {[
          { name: 'Engineering', total: 24, done: 18, color: '#4F46E5' },
          { name: 'Design',      total: 16, done: 14, color: '#10B981' },
          { name: 'Marketing',   total: 12, done:  7, color: '#F59E0B' },
          { name: 'QA',          total: 10, done:  9, color: '#EF4444' },
        ].map((d) => {
          const pct = Math.round((d.done / d.total) * 100)
          return (
            <div key={d.name}>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                <span className="font-semibold text-foreground">{d.name}</span>
                <span>{d.done}/{d.total} tasks · {pct}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
              </div>
            </div>
          )
        })}
        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: 'Completed', val: 48, color: '#10B981' },
            { label: 'Active',    val: 14, color: '#6366F1' },
            { label: 'Overdue',   val: 4,  color: '#EF4444' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: s.color + '12' }}>
              <div className="text-lg font-extrabold" style={{ color: s.color }}>{s.val}</div>
              <div className="text-[9px] text-muted-foreground uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
]

function DeepDiveSection() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden" aria-labelledby="deepdive-heading">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Feature Deep Dive
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="deepdive-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            See How It{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Works in Practice
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground leading-relaxed">
            Real product UI previews for the features that matter most.
          </motion.p>
        </div>

        {/* Alternating rows */}
        <div className="space-y-24">
          {deepDives.map((d, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div key={d.title}
                initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
                className={cn(
                  'grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center',
                  !isEven && 'lg:grid-flow-col-dense',
                )}>
                {/* Text side */}
                <motion.div variants={cardIn} className={cn(!isEven && 'lg:col-start-2')}>
                  <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                    style={{ backgroundColor: d.color + '18', color: d.color }}>
                    {d.tag}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-4 leading-snug">
                    {d.title}
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-8">{d.desc}</p>
                  <ul className="space-y-3">
                    {d.points.map((p) => {
                      const Icon = p.icon
                      return (
                        <li key={p.text} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: d.color + '15' }}>
                            <Icon size={15} style={{ color: d.color }} />
                          </div>
                          <span className="text-sm font-medium text-foreground">{p.text}</span>
                        </li>
                      )
                    })}
                  </ul>
                </motion.div>

                {/* Visual side */}
                <motion.div variants={cardIn}
                  className={cn('relative', !isEven && 'lg:col-start-1 lg:row-start-1')}>
                  {/* Glow behind */}
                  <div className="pointer-events-none absolute -inset-6 rounded-3xl opacity-[0.12] blur-2xl"
                    style={{ backgroundColor: d.color }} aria-hidden="true" />
                  <div className="relative">
                    {d.visual}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — Platform Highlights (icon grid)
// ─────────────────────────────────────────────────────────────
const highlights = [
  { icon: Lock,         color: '#8B5CF6', title: 'Secure by Design',     desc: 'Cookie-based sessions, role guards, and RBAC protect every route and resource.' },
  { icon: Smartphone,   color: '#3B82F6', title: 'Fully Responsive',      desc: 'Pixel-perfect on mobile, tablet, and desktop. Touch-friendly and fast everywhere.' },
  { icon: Globe,        color: '#10B981', title: 'Dark & Light Mode',     desc: 'System-aware theme switching with zero flicker, powered by next-themes.' },
  { icon: Zap,          color: '#F59E0B', title: 'Instant Performance',   desc: 'TanStack Query caching keeps your data fresh and UI snappy at all times.' },
  { icon: History,      color: '#EF4444', title: 'Full Audit Trail',      desc: 'Every action is logged — who did what, on which entity, and when.' },
  { icon: RefreshCw,    color: '#4F46E5', title: 'Real-time Updates',     desc: 'Mutations instantly reflect in the UI without manual page refreshes.' },
  { icon: Monitor,      color: '#22C55E', title: 'Dashboard Analytics',   desc: 'Interactive Recharts visualisations for task, project, and team metrics.' },
  { icon: MessageSquare,color: '#F97316', title: 'Comment Threads',       desc: 'Contextual comments on tasks with timestamps and user attribution.' },
]

function PlatformHighlights() {
  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden" aria-labelledby="highlights-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Platform Quality
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="highlights-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Built With{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Production Quality
            </span>{' '}in Mind
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground leading-relaxed">
            Every detail has been engineered for reliability, speed, accessibility, and a great developer experience.
          </motion.p>
        </div>

        {/* 4-col grid */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {highlights.map((h) => {
            const Icon = h.icon
            return (
              <motion.div key={h.title} variants={cardIn}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col gap-3 p-5 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Top accent */}
                <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg,${h.color}00,${h.color},${h.color}00)` }} />
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: h.color + '15' }}>
                  <Icon size={18} style={{ color: h.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-1">{h.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{h.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 5 — CTA Banner
// ─────────────────────────────────────────────────────────────
function FeatureCTA() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[500px] w-[900px] rounded-full opacity-[0.07] dark:opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-indigo)),transparent 60%)' }} />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Stars */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="flex items-center justify-center gap-1 mb-6">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} size={18} className="text-warning fill-warning" />
          ))}
          <span className="ml-2 text-sm font-semibold text-foreground">Rated 4.9/5 by 2,000+ teams</span>
        </motion.div>

        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
          Ready to Transform{' '}
          <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
            How Your Team Works?
          </span>
        </motion.h2>

        <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
          className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          Join thousands of teams who use TaskFlow Pro to ship faster, collaborate better, and stay organised.
        </motion.p>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.3} variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Start For Free
            <ArrowRight size={15} />
          </Link>
          <Link href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-foreground border border-border bg-card hover:bg-muted hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Back to Home
          </Link>
        </motion.div>

        {/* Checklist */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.4} variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {['No credit card required', 'Free for small teams', 'Setup in 2 minutes', 'Cancel anytime'].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check size={13} className="text-primary shrink-0" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Page export — compose all sections
// ─────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <>
      <FeatureHero />
      <CoreFeaturesSection />
      <DeepDiveSection />
      <PlatformHighlights />
      <FeatureCTA />
    </>
  )
}
