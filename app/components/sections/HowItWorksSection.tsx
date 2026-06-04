'use client'

import { motion } from 'framer-motion'
import { FolderPlus, UserPlus, ClipboardList, TrendingUp, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Step data ──────────────────────────────────────────────────
const steps = [
  {
    icon: FolderPlus,
    title: 'Create a Project',
    description: 'Start by creating your project, defining goals, and setting key milestones for your team to hit.',
    color: '#4F46E5',
  },
  {
    icon: UserPlus,
    title: 'Add Team Members',
    description: 'Invite your team with a single link, assign roles, and set individual responsibilities.',
    color: '#3B82F6',
  },
  {
    icon: ClipboardList,
    title: 'Assign Tasks',
    description: 'Break work into manageable tasks, set priorities, deadlines, and dependencies.',
    color: '#8B5CF6',
  },
  {
    icon: TrendingUp,
    title: 'Track Progress',
    description: 'Monitor real-time status updates, velocity charts, and team productivity dashboards.',
    color: '#10B981',
  },
  {
    icon: Trophy,
    title: 'Complete Successfully',
    description: 'Deliver projects on time and celebrate milestones with your team — every time.',
    color: '#F59E0B',
  },
]

// ── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ── Desktop step ───────────────────────────────────────────────
function DesktopStep({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const { icon: Icon, title, description, color } = step
  return (
    <motion.div
      initial="hidden" whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      custom={index * 0.12} variants={fadeUp}
      className="relative flex flex-col items-center text-center group"
    >
      {/* Connector line */}
      {!isLast && (
        <div className="absolute top-9 left-[calc(50%+28px)] right-0 h-px z-0" aria-hidden="true">
          <motion.div
            initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="h-full origin-left"
            style={{ background: `linear-gradient(90deg,${color}60,${steps[index + 1].color}60)` }}
          />
          <motion.div
            initial={{ x: '0%', opacity: 0 }}
            whileInView={{ x: '100%', opacity: [0, 1, 0] }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: index * 0.15 + 0.6, ease: 'easeInOut' }}
            className="absolute top-1/2 -translate-y-1/2 h-2 w-2 rounded-full"
            style={{ backgroundColor: color, left: 0 }}
            aria-hidden="true"
          />
        </div>
      )}

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.25 }}
        className={cn(
          'relative z-10 mb-5 h-[72px] w-[72px] rounded-2xl flex items-center justify-center',
          'bg-card border-2 shadow-lg group-hover:shadow-xl transition-shadow duration-300',
        )}
        style={{ borderColor: color + '40' }}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md"
          style={{ backgroundColor: color + '30' }}
          aria-hidden="true"
        />
        <Icon size={28} style={{ color }} strokeWidth={1.8} />
        <span
          className="absolute -top-2.5 -right-2.5 h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </span>
      </motion.div>

      <h3 className="text-base font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[180px]">{description}</p>
    </motion.div>
  )
}

// ── Mobile step ────────────────────────────────────────────────
function MobileStep({ step, index, isLast }: { step: typeof steps[0]; index: number; isLast: boolean }) {
  const { icon: Icon, title, description, color } = step
  return (
    <motion.div
      initial="hidden" whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      custom={index * 0.1} variants={fadeUp}
      className="relative flex gap-5"
    >
      {/* Vertical connector */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px z-0" aria-hidden="true">
          <motion.div
            initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
            className="h-full w-full origin-top"
            style={{ backgroundColor: color + '50' }}
          />
        </div>
      )}

      {/* Icon */}
      <div
        className="relative z-10 shrink-0 h-12 w-12 rounded-xl flex items-center justify-center bg-card border-2 shadow-md"
        style={{ borderColor: color + '40' }}
      >
        <Icon size={22} style={{ color }} strokeWidth={1.8} />
        <span
          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {index + 1}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <h3 className="text-base font-bold text-foreground mb-1.5 leading-snug">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

// ── Section ────────────────────────────────────────────────────
export default function HowItWorksSection() {
  return (
    <section
      className="relative py-20 md:py-32 bg-card overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Separators */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      {/* Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-indigo)),transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Simple Process
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.1 }}
            id="how-it-works-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5"
          >
            How{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              TaskFlow Pro
            </span>{' '}
            Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Get started in minutes and streamline your entire project workflow.
          </motion.p>
        </div>

        {/* Desktop timeline */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <DesktopStep key={step.title} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* Mobile timeline */}
        <div className="md:hidden max-w-md mx-auto">
          {steps.map((step, i) => (
            <MobileStep key={step.title} step={step} index={i} isLast={i === steps.length - 1} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20 text-center"
        >
          <a
            href="/signup"
            className={cn(
              'inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl',
              'text-sm font-semibold text-primary-foreground',
              'bg-gradient-to-r from-primary to-tf-indigo',
              'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35',
              'hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            )}
          >
            Start Your First Project →
          </a>
          <p className="mt-3 text-xs text-muted-foreground">Free to start · No credit card required</p>
        </motion.div>
      </div>
    </section>
  )
}
