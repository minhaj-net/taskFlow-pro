'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const perks = [
  'Free 14-day trial',
  'No credit card required',
  'Cancel any time',
  '24/7 support',
]

export default function CTASection() {
  return (
    <section
      className="relative py-20 md:py-32 overflow-hidden bg-background"
      aria-labelledby="cta-heading"
    >
      {/* Separators */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      {/* ── Gradient background card ────────────────────────────── */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/5"
        >
          {/* Gradient fill (theme-aware via CSS vars so it shifts in dark mode) */}
          <div
            className="absolute inset-0 opacity-[0.08] dark:opacity-[0.12]"
            style={{
              background:
                'radial-gradient(ellipse at 20% 50%, rgb(var(--tf-emerald)) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgb(var(--tf-indigo)) 0%, transparent 55%)',
            }}
            aria-hidden="true"
          />

          {/* Decorative blurred orbs */}
          <div
            className="pointer-events-none absolute -top-20 -left-20 h-60 w-60 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: 'rgb(var(--tf-emerald))' }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: 'rgb(var(--tf-indigo))' }}
            aria-hidden="true"
          />

          {/* Grid overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
            aria-hidden="true"
          />

          {/* Content */}
          <div className="relative px-8 py-14 sm:px-14 sm:py-20 text-center flex flex-col items-center gap-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold text-primary">Start for free today</span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              id="cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground max-w-3xl"
            >
              Ready To Improve Your{' '}
              <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
                Team&apos;s Productivity?
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Join thousands of teams already managing projects smarter with TaskFlow Pro.
            </motion.p>

            {/* Perks */}
            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
              aria-label="Plan perks"
            >
              {perks.map((p) => (
                <li key={p} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  {p}
                </li>
              ))}
            </motion.ul>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4"
            >
              {/* Primary */}
              <a
                href="/signup"
                className={cn(
                  'group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl',
                  'text-sm font-semibold text-primary-foreground',
                  'bg-gradient-to-r from-primary to-tf-emerald',
                  'shadow-lg shadow-primary/30',
                  'hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5',
                  'active:translate-y-0 active:shadow-md',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'w-full sm:w-auto justify-center',
                )}
              >
                Start Free
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </a>

              {/* Secondary */}
              <a
                href="/demo"
                className={cn(
                  'group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl',
                  'text-sm font-semibold text-foreground',
                  'border border-border bg-card/80 backdrop-blur-sm',
                  'hover:bg-muted hover:border-primary/40',
                  'hover:-translate-y-0.5 active:translate-y-0',
                  'transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  'w-full sm:w-auto justify-center',
                )}
              >
                <Play size={14} className="text-primary" fill="currentColor" />
                Book Demo
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
