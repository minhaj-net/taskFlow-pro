'use client'

import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, Mail, Lock, User, ArrowRight,
  AlertCircle, CheckCircle2, Loader2, ShieldCheck,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Password strength ─────────────────────────────────────────
interface StrengthResult { score: 0 | 1 | 2 | 3 | 4; label: string; color: string }

function getStrength(pw: string): StrengthResult {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)                         score++
  if (/[A-Z]/.test(pw))                       score++
  if (/[0-9]/.test(pw))                       score++
  if (/[^A-Za-z0-9]/.test(pw))               score++

  const map: Record<number, { label: string; color: string }> = {
    1: { label: 'Weak',   color: '#EF4444' },
    2: { label: 'Fair',   color: '#F59E0B' },
    3: { label: 'Good',   color: '#3B82F6' },
    4: { label: 'Strong', color: '#22C55E' },
  }
  return { score: score as StrengthResult['score'], ...(map[score] ?? map[1]) }
}

function StrengthBar({ password }: { password: string }) {
  const { score, label, color } = getStrength(password)
  if (!password) return null
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="mt-2 space-y-1.5">
        <div className="flex gap-1" role="meter" aria-label={`Password strength: ${label}`} aria-valuenow={score} aria-valuemin={0} aria-valuemax={4}>
          {[1, 2, 3, 4].map((s) => (
            <motion.div
              key={s}
              className="h-1 flex-1 rounded-full bg-muted overflow-hidden"
            >
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: score >= s ? '100%' : '0%' }}
                transition={{ duration: 0.3, delay: s * 0.05 }}
                style={{ backgroundColor: score >= s ? color : undefined }}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] font-medium" style={{ color }}>{label}</p>
      </div>
    </motion.div>
  )
}

// ── Field error type ──────────────────────────────────────────
interface FieldError {
  name?: string
  email?: string
  password?: string
  confirm?: string
  terms?: string
}

function validate(name: string, email: string, password: string, confirm: string, terms: boolean): FieldError {
  const e: FieldError = {}
  if (!name.trim())             e.name     = 'Full name is required.'
  if (!email.trim())            e.email    = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address.'
  if (!password)                e.password = 'Password is required.'
  else if (password.length < 8) e.password = 'Password must be at least 8 characters.'
  if (!confirm)                 e.confirm  = 'Please confirm your password.'
  else if (confirm !== password) e.confirm = 'Passwords do not match.'
  if (!terms)                   e.terms    = 'You must accept the terms to continue.'
  return e
}

// ── Reusable input (same as LoginForm) ───────────────────────
interface InputProps {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder: string
  error?: string
  icon: React.ElementType
  rightElement?: React.ReactNode
  autoComplete?: string
  hint?: React.ReactNode
}

function FormInput({ id, label, type, value, onChange, placeholder, error, icon: Icon, rightElement, autoComplete, hint }: InputProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Icon size={16} />
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            'w-full rounded-xl border bg-background py-3 pl-10 text-sm text-foreground placeholder:text-muted-foreground/60',
            'transition-all duration-150 outline-none',
            'focus:ring-2 focus:ring-ring focus:border-transparent',
            rightElement ? 'pr-11' : 'pr-4',
            error
              ? 'border-destructive ring-1 ring-destructive/30'
              : 'border-border hover:border-muted-foreground/40',
          )}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
        )}
      </div>
      {hint}
      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="err"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 text-xs text-destructive overflow-hidden"
          >
            <AlertCircle size={12} className="shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────
export default function RegisterForm() {
  const router    = useRouter()
  const nameId    = useId()
  const emailId   = useId()
  const passId    = useId()
  const confirmId = useId()

  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPass]   = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowP]  = useState(false)
  const [showConf, setShowC]  = useState(false)
  const [terms, setTerms]     = useState(false)
  const [errors, setErrors]   = useState<FieldError>({})
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [globalError, setGlobalError] = useState('')

  const clearField = (field: keyof FieldError) =>
    setErrors((p) => ({ ...p, [field]: '' }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError('')
    const errs = validate(name, email, password, confirm, terms)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStatus('loading')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        }
      )
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Registration failed.')
      setStatus('success')
      // Redirect to login after 1.5s
      setTimeout(() => router.push('/login'), 1500)
    } catch (err: unknown) {
      setStatus('error')
      setGlobalError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-1.5">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Free for 14 days — no credit card required
        </p>
      </div>

      {/* Global error */}
      <AnimatePresence>
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="mb-5 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle size={15} className="shrink-0" />
            {globalError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="mb-5 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success"
            role="status"
          >
            <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            <div>
              <strong>Account created!</strong> Redirecting to login…
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full name */}
        <FormInput
          id={nameId} label="Full name" type="text"
          value={name} onChange={(v) => { setName(v); clearField('name') }}
          placeholder="Jane Smith" error={errors.name} icon={User} autoComplete="name"
        />

        {/* Email */}
        <FormInput
          id={emailId} label="Email address" type="email"
          value={email} onChange={(v) => { setEmail(v); clearField('email') }}
          placeholder="you@company.com" error={errors.email} icon={Mail} autoComplete="email"
        />

        {/* Password + strength */}
        <FormInput
          id={passId} label="Password" type={showPass ? 'text' : 'password'}
          value={password} onChange={(v) => { setPass(v); clearField('password') }}
          placeholder="Min. 8 characters" error={errors.password} icon={Lock}
          autoComplete="new-password"
          hint={
            <AnimatePresence>
              {password && <StrengthBar password={password} />}
            </AnimatePresence>
          }
          rightElement={
            <button type="button" onClick={() => setShowP((s) => !s)}
              aria-label={showPass ? 'Hide password' : 'Show password'}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Confirm password */}
        <FormInput
          id={confirmId} label="Confirm password" type={showConf ? 'text' : 'password'}
          value={confirm} onChange={(v) => { setConfirm(v); clearField('confirm') }}
          placeholder="Re-enter your password" error={errors.confirm} icon={ShieldCheck}
          autoComplete="new-password"
          rightElement={
            <button type="button" onClick={() => setShowC((s) => !s)}
              aria-label={showConf ? 'Hide confirmation' : 'Show confirmation'}
              className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
              {showConf ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Terms */}
        <div className="space-y-1">
          <label className="flex items-start gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => { setTerms(e.target.checked); clearField('terms') }}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-primary cursor-pointer"
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none leading-snug">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-primary hover:text-primary/80 underline underline-offset-2">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-primary hover:text-primary/80 underline underline-offset-2">
                Privacy Policy
              </Link>
            </span>
          </label>
          <AnimatePresence>
            {errors.terms && (
              <motion.p
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-1.5 text-xs text-destructive overflow-hidden" role="alert"
              >
                <AlertCircle size={12} className="shrink-0" />
                {errors.terms}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          whileHover={{ scale: status === 'loading' ? 1 : 1.015 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            'group relative w-full flex items-center justify-center gap-2.5 rounded-xl py-3 px-5 mt-1',
            'text-sm font-semibold text-primary-foreground',
            'bg-gradient-to-r from-primary to-tf-indigo',
            'shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {status === 'loading' ? (
            <Loader2 size={17} className="animate-spin" />
          ) : status === 'success' ? (
            <><CheckCircle2 size={17} /> Account Created</>
          ) : (
            <>
              Create Account
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </motion.button>
      </form>

      {/* Switch */}
      <p className="mt-7 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          Sign in →
        </Link>
      </p>
    </div>
  )
}
