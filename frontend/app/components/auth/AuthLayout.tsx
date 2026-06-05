'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/app/components/ThemeToggle'
import FloatingDecoration from './FloatingDecoration'

interface AuthLayoutProps {
  children: React.ReactNode
  /** 'login' | 'register' — used to show the correct panel label */
  mode: 'login' | 'register'
}

export default function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="flex min-h-[100dvh] w-full overflow-hidden">

      {/* ── LEFT PANEL — Visual / Brand (desktop only) ─────────── */}
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">

        {/* Animated mesh gradient */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 0% 0%,rgb(var(--tf-emerald)/0.18) 0%,transparent 50%), radial-gradient(ellipse at 100% 100%,rgb(var(--tf-indigo)/0.18) 0%,transparent 50%)',
          }}
          aria-hidden="true"
        />

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 px-10 pt-10">
          <Link href="/" className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 transition-shadow duration-200">
              <Zap size={18} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-base font-bold text-foreground">
              TaskFlow{' '}
              <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">Pro</span>
            </span>
          </Link>
        </div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative z-10 px-10 mt-16"
        >
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-4">
            Manage Projects,{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Tasks & Teams
            </span>{' '}
            Efficiently
          </h2>
          <p className="text-base text-muted-foreground max-w-sm leading-relaxed">
            Join 10,000+ teams already using TaskFlow Pro to collaborate smarter and ship faster.
          </p>
        </motion.div>

        {/* Floating UI decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="relative z-10 flex-1 px-6 pb-6 pt-8"
        >
          <FloatingDecoration />
        </motion.div>

        {/* Bottom trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="relative z-10 px-10 pb-10 flex items-center gap-6"
        >
          {[
            { value: '10K+', label: 'Teams' },
            { value: '98%',  label: 'Satisfaction' },
            { value: '250K+',label: 'Tasks done' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-lg font-extrabold text-foreground">{value}</div>
              <div className="text-[11px] text-muted-foreground">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL — Auth Form ────────────────────────────── */}
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8 bg-background">

        {/* Theme toggle — top right */}
        <div className="absolute right-5 top-5">
          <ThemeToggle />
        </div>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <Link href="/" className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center shadow-md shadow-primary/30">
              <Zap size={16} className="text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-[15px] font-bold text-foreground">
              TaskFlow <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">Pro</span>
            </span>
          </Link>
        </div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'w-full max-w-md',
            'rounded-2xl border border-border bg-card',
            'shadow-xl shadow-black/5 dark:shadow-black/30',
            'p-8 sm:p-10',
          )}
        >
          {children}
        </motion.div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-muted-foreground text-center">
          By continuing you agree to our{' '}
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground transition-colors">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-foreground transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
