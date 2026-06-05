'use client'

import { motion } from 'framer-motion'
import {
  Users, TrendingUp, LayoutDashboard,
  BarChart3, ShieldCheck, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────
const benefits = [
  {
    icon: Users,
    title: 'Faster Team Collaboration',
    description: 'Real-time updates, inline comments, and shared workspaces keep every team member aligned — no more missed messages.',
    color: '#10B981',
    gradient: 'from-emerald-500/10 to-teal-500/5',
  },
  {
    icon: TrendingUp,
    title: 'Better Productivity',
    description: 'Eliminate bottlenecks with smart task priorities, automated reminders, and sprint velocity dashboards.',
    color: '#4F46E5',
    gradient: 'from-indigo-500/10 to-violet-500/5',
  },
  {
    icon: LayoutDashboard,
    title: 'Centralised Management',
    description: 'One platform for projects, tasks, files, and conversations — replace the chaos of multiple disconnected tools.',
    color: '#3B82F6',
    gradient: 'from-blue-500/10 to-sky-500/5',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Turn data into decisions with real-time charts, burndown reports, and team performance insights.',
    color: '#F59E0B',
    gradient: 'from-amber-500/10 to-orange-500/5',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Access Control',
    description: 'Role-based permissions, SSO, 2FA, and audit logs keep your data protected without slowing anyone down.',
    color: '#EF4444',
    gradient: 'from-red-500/10 to-rose-500/5',
  },
  {
    icon: Sparkles,
    title: 'Modern User Experience',
    description: 'A clean, intuitive interface your team will actually want to use — available on web, iOS, and Android.',
    color: '#8B5CF6',
    gradient: 'from-violet-500/10 to-purple-500/5',
  },
]

// ── Card ──────────────────────────────────────────────────────
function BenefitCard({
  benefit,
  index,
}: {
  benefit: typeof benefits[0]
  index: number
}) {
  const { icon: Icon, title, description, color, gradient } = benefit
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={cn(
        'group relative flex flex-col gap-4 p-6 rounded-2xl overflow-hidden cursor-default',
        'bg-card border border-border',
        'shadow-sm hover:shadow-xl transition-all duration-300',
      )}
    >
      {/* Gradient bg on hover */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          gradient,
        )}
        aria-hidden="true"
      />
      {/* Top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,${color}00,${color},${color}00)` }}
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300"
          style={{ backgroundColor: color + '15' }}
        >
          <Icon size={22} style={{ color }} strokeWidth={1.8} />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Index watermark */}
      <span
        className="absolute bottom-2 right-3 text-[64px] font-black opacity-[0.04] select-none leading-none"
        style={{ color }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </span>
    </motion.article>
  )
}

// ── Section ───────────────────────────────────────────────────
export default function BenefitsSection() {
  return (
    <section
      className="relative py-20 md:py-32 bg-muted/30 overflow-hidden"
      aria-labelledby="benefits-heading"
    >
      {/* Separators */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      {/* Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-emerald)),transparent 65%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Why TaskFlow Pro
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }}
            id="benefits-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5"
          >
            Why Choose{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              TaskFlow Pro
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Designed to help teams collaborate better, work faster, and deliver projects successfully.
          </motion.p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          role="list"
        >
          {benefits.map((b, i) => (
            <div key={b.title} role="listitem">
              <BenefitCard benefit={b} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
