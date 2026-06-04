'use client'

import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  AlertCircle, CheckCircle2, Loader2, ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { loginWithCredentials } from '@/services/user-service'
import { ROLE_DASHBOARD } from '@/types'

// ── Validation ────────────────────────────────────────────────
interface FieldError { email?: string; password?: string }

function validate(email: string, password: string): FieldError {
  const errors: FieldError = {}
  if (!email.trim())                                              errors.email    = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))          errors.email    = 'Enter a valid email address.'
  if (!password)                                                  errors.password = 'Password is required.'
  else if (password.length < 6)                                  errors.password = 'Password must be at least 6 characters.'
  return errors
}

// ── Reusable input ────────────────────────────────────────────
interface InputProps {
  id: string; label: string; type: string
  value: string; onChange: (v: string) => void
  placeholder: string; error?: string
  icon: React.ElementType; rightElement?: React.ReactNode
  autoComplete?: string
}

function FormInput({ id, label, type, value, onChange, placeholder, error, icon: Icon, rightElement, autoComplete }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon size={16} />
        </span>
        <input
          id={id} type={type} value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete}
          aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'w-full rounded-xl border bg-background py-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground/60',
            'transition-all duration-150 outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            rightElement ? 'pr-11' : 'pr-4',
            error ? 'border-destructive ring-1 ring-destructive/30' : 'border-border hover:border-muted-foreground/40',
          )}
        />
        {rightElement && <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>}
      </div>
      <AnimatePresence mode="wait">
        {error && (
          <motion.p key="error" id={`${id}-error`} role="alert"
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-destructive overflow-hidden">
            <AlertCircle size={12} className="shrink-0" />{error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Demo credentials ──────────────────────────────────────────
const DEMO_ACCOUNTS = [
  { label: 'Admin',           email: 'admin@demo.com',   password: 'Admin123',   badge: 'Full access'     },
  { label: 'Project Manager', email: 'manager@demo.com', password: 'Manager123', badge: 'Manage projects' },
  { label: 'Team Member',     email: 'member@demo.com',  password: 'Member123',  badge: 'View tasks'      },
]

// ── Main form ─────────────────────────────────────────────────
export default function LoginForm() {
  const router   = useRouter()
  const emailId  = useId()
  const passId   = useId()

  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPass, setShowPass]         = useState(false)
  const [remember, setRemember]         = useState(false)
  const [errors, setErrors]             = useState<FieldError>({})
  const [status, setStatus]             = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [globalError, setGlobalError]   = useState('')
  const [showDemoMenu, setShowDemoMenu] = useState(false)

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email)
    setPassword(acc.password)
    setErrors({})
    setGlobalError('')
    setShowDemoMenu(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    const errs = validate(email, password)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')
    try {
      const session = await loginWithCredentials(email, password)
      setStatus('success')
      // Set cookie so middleware can gate dashboard routes
      document.cookie = `tfp_auth=1; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `tfp_role=${session.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`
      // Redirect based on role
      const destination = ROLE_DASHBOARD[session.user.role]
      setTimeout(() => router.push(destination), 600)
    } catch (err: unknown) {
      setStatus('error')
      setGlobalError(err instanceof Error ? err.message : 'Login failed. Try a demo account.')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-1.5">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Sign in to your TaskFlow Pro account</p>
      </div>

      {/* Global error */}
      <AnimatePresence>
        {globalError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive" role="alert">
            <AlertCircle size={15} className="shrink-0" />{globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-center gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success" role="status">
            <CheckCircle2 size={15} className="shrink-0" />Logged in! Redirecting to your dashboard…
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormInput id={emailId} label="Email address" type="email"
          value={email} onChange={(v) => { setEmail(v); setErrors((p) => ({ ...p, email: '' })) }}
          placeholder="you@company.com" error={errors.email} icon={Mail} autoComplete="email" />

        <FormInput id={passId} label="Password" type={showPass ? 'text' : 'password'}
          value={password} onChange={(v) => { setPassword(v); setErrors((p) => ({ ...p, password: '' })) }}
          placeholder="••••••••" error={errors.password} icon={Lock} autoComplete="current-password"
          rightElement={
            <button type="button" onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          } />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border accent-primary cursor-pointer" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">
              Remember me
            </span>
          </label>
          <Link href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <motion.button type="submit" disabled={status === 'loading' || status === 'success'}
          whileHover={{ scale: status === 'loading' ? 1 : 1.015 }} whileTap={{ scale: 0.98 }}
          className={cn(
            'group relative w-full flex items-center justify-center gap-2.5 rounded-xl py-3 px-5',
            'text-sm font-semibold text-primary-foreground',
            'bg-gradient-to-r from-primary to-tf-indigo',
            'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}>
          {status === 'loading' ? <Loader2 size={17} className="animate-spin" />
            : status === 'success' ? <CheckCircle2 size={17} />
            : <><span>Sign In</span><ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" /></>}
        </motion.button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-3 text-xs text-muted-foreground">or try a demo account</span>
          </div>
        </div>

        {/* Demo accounts dropdown */}
        <div className="relative">
          <motion.button type="button" whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowDemoMenu((s) => !s)}
            className={cn(
              'w-full flex items-center justify-between rounded-xl border border-border bg-background py-3 px-5',
              'text-sm font-medium text-foreground',
              'hover:bg-muted hover:border-primary/40',
              'transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}>
            <span className="text-primary font-semibold">Demo Login</span>
            <ChevronDown size={15} className={cn('text-muted-foreground transition-transform duration-200', showDemoMenu && 'rotate-180')} />
          </motion.button>

          <AnimatePresence>
            {showDemoMenu && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 top-full mt-1.5 z-10 rounded-xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button key={acc.email} type="button" onClick={() => fillDemo(acc)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted transition-colors group">
                    <div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{acc.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{acc.email}</div>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">
                      {acc.badge}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link href="/register"
          className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          Create one →
        </Link>
      </p>
    </div>
  )
}
