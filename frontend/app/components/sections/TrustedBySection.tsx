'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Users, CheckCircle2, SmilePlus, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Animation ─────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (delay = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

// ── Counter hook ──────────────────────────────────────────────
function useCounter(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let raf: number
    const startTime = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return count
}

// ── Logos ─────────────────────────────────────────────────────
const logos = [
  { name: 'Microsoft', w: 80 },
  { name: 'Google',    w: 58 },
  { name: 'Amazon',    w: 62 },
  { name: 'Stripe',    w: 44 },
  { name: 'Notion',    w: 50 },
  { name: 'Shopify',   w: 54 },
  { name: 'Slack',     w: 38 },
  { name: 'Airbnb',    w: 48 },
]

// ── Metric card ───────────────────────────────────────────────
interface MetricCardProps {
  icon: React.ElementType
  target: number
  suffix: string
  label: string
  color: string
  delay: number
  started: boolean
}

function MetricCard({ icon: Icon, target, suffix, label, color, delay, started }: MetricCardProps) {
  const count = useCounter(target, 1600, started)
  const formatted = count >= 1000 ? `${(count / 1000).toFixed(0)}K` : count.toString()
  return (
    <motion.div
      initial="hidden" whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      custom={delay} variants={fadeUp}
      whileHover={{ scale: 1.03, y: -4 }}
      className={cn(
        'flex flex-col items-center text-center p-6 rounded-2xl cursor-default',
        'bg-card border border-border',
        'shadow-sm hover:shadow-md transition-all duration-300',
      )}
    >
      <div
        className="mb-4 h-12 w-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: color + '18' }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="text-2xl sm:text-3xl font-extrabold text-foreground tabular-nums">
        {formatted}{suffix}
      </div>
      <div className="mt-1.5 text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  )
}

// ── Metrics data ──────────────────────────────────────────────
const metrics = [
  { icon: Users,        target: 10000,  suffix: '+', label: 'Active Teams',          color: '#4F46E5' },
  { icon: CheckCircle2, target: 250000, suffix: '+', label: 'Tasks Managed',          color: '#22C55E' },
  { icon: SmilePlus,    target: 98,     suffix: '%', label: 'Customer Satisfaction',  color: '#F59E0B' },
  { icon: Globe,        target: 50,     suffix: '+', label: 'Countries Served',       color: '#3B82F6' },
]

// ── Section ───────────────────────────────────────────────────
export default function TrustedBySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-card overflow-hidden"
      aria-labelledby="trusted-heading"
    >
      {/* Separators */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      {/* Glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full opacity-[0.04] dark:opacity-[0.07] blur-3xl"
        style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-indigo)),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}
          custom={0} variants={fadeUp}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Social Proof
          </p>
          <h2
            id="trusted-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4"
          >
            Trusted by Leading Teams{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="max-w-xl mx-auto text-base text-muted-foreground leading-relaxed">
            Thousands of companies rely on our platform to manage projects, collaborate with teams, and deliver work efficiently.
          </p>
        </motion.div>

        {/* Logo grid */}
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px rounded-2xl overflow-hidden border border-border mb-16"
          role="list"
          aria-label="Companies using TaskFlow Pro"
        >
          {logos.map((logo) => (
            <motion.div
              key={logo.name}
              role="listitem"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.4 } } }}
              whileHover={{ scale: 1.05 }}
              className={cn(
                'group flex items-center justify-center p-6 sm:p-8 cursor-default',
                'bg-card text-muted-foreground/50',
                'hover:text-foreground hover:bg-muted',
                'transition-all duration-200',
              )}
            >
              {/* SVG text logo — inherits currentColor so it respects theme */}
              <svg
                viewBox={`0 0 ${logo.w} 24`}
                className="h-5 w-auto"
                aria-label={logo.name}
                fill="currentColor"
              >
                <text x="0" y="18" fontSize="15" fontWeight="700" fontFamily="system-ui,Arial,sans-serif">
                  {logo.name}
                </text>
              </svg>
            </motion.div>
          ))}
        </motion.div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} {...m} delay={0.1 * i} started={isInView} />
          ))}
        </div>
      </div>
    </section>
  )
}
