'use client'

import { motion } from 'framer-motion'
import { FolderKanban, CheckSquare, Users, BarChart3, History, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────
const features = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description: 'Create, organise, and manage projects with powerful boards, timelines, and milestone tracking built for modern teams.',
    color: '#4F46E5',
    badge: 'Core',
  },
  {
    icon: CheckSquare,
    title: 'Task Management',
    description: 'Assign tasks, set priorities, and monitor progress with drag-and-drop workflows that keep everyone aligned.',
    color: '#10B981',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Collaborate in real-time with inline comments, @mentions, shared workspaces, and seamless file attachments.',
    color: '#3B82F6',
    badge: 'Popular',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Monitor team performance, sprint velocity, and productivity trends with beautiful, interactive charts.',
    color: '#F59E0B',
  },
  {
    icon: History,
    title: 'Activity Logs',
    description: 'Track every change across projects with a detailed, filterable activity feed so nothing ever slips through the cracks.',
    color: '#8B5CF6',
  },
  {
    icon: Bell,
    title: 'Notification System',
    description: 'Receive smart, contextual alerts via in-app, email, or Slack so you always know what needs your attention.',
    color: '#EF4444',
  },
]

// ── Animation ─────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const headingVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ── Feature Card ──────────────────────────────────────────────
function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { icon: Icon, title, description, color, badge } = feature
  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative flex flex-col p-6 rounded-2xl overflow-hidden cursor-default',
        'bg-card border border-border',
        'shadow-sm hover:shadow-xl transition-all duration-300',
      )}
      aria-label={title}
    >
      {/* Top gradient line on hover */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,${color}00,${color},${color}00)` }}
        aria-hidden="true"
      />
      {/* Corner glow on hover */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{ backgroundColor: color + '20' }}
        aria-hidden="true"
      />

      {/* Badge */}
      {badge && (
        <span
          className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{ backgroundColor: color + '18', color }}
        >
          {badge}
        </span>
      )}

      {/* Icon */}
      <motion.div
        whileHover={{ rotate: [0, -8, 8, 0] }}
        transition={{ duration: 0.4 }}
        className="mb-5 h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + '15' }}
      >
        <Icon size={22} style={{ color }} strokeWidth={2} />
      </motion.div>

      <div className="flex flex-col flex-1">
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground flex-1">{description}</p>
        <div
          className="mt-4 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color }}
        >
          Learn more →
        </div>
      </div>

      {/* Index watermark */}
      <div
        className="pointer-events-none absolute -bottom-4 -right-2 text-[80px] font-black opacity-[0.04] select-none"
        style={{ color, lineHeight: 1 }}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.article>
  )
}

// ── Section ───────────────────────────────────────────────────
export default function FeaturesSection() {
  return (
    <section
      className="relative py-20 md:py-32 bg-background overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--border)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--border)) 1px,transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden="true"
      />
      {/* Glows */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.p
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
            custom={0} variants={headingVariants}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Platform Features
          </motion.p>
          <motion.h2
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
            custom={0.1} variants={headingVariants}
            id="features-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5"
          >
            Everything You Need To{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Manage Projects
            </span>{' '}
            Efficiently
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}
            custom={0.2} variants={headingVariants}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            Powerful tools to help teams collaborate, organise work, and track progress in one centralised platform.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div
          initial="hidden" whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          role="list"
        >
          {features.map((feature, index) => (
            <div key={feature.title} role="listitem">
              <FeatureCard feature={feature} index={index} />
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">And dozens more features to explore</p>
          <a
            href="/features"
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold',
              'text-primary border border-primary/30 bg-primary/10',
              'hover:bg-primary/20 hover:-translate-y-0.5',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
          >
            Explore All Features →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
