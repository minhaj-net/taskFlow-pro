'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ForgotPasswordForm() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error,   setError]   = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setStatus('loading')
    // Simulate email send (no backend endpoint for this yet)
    await new Promise(r => setTimeout(r, 1200))
    setStatus('success')
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground mb-1.5">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <AnimatePresence>
        {status === 'success' ? (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Check your inbox</h2>
              <p className="text-sm text-muted-foreground mt-1">
                If <span className="font-semibold text-foreground">{email}</span> exists in our system,
                you'll receive a reset link shortly.
              </p>
            </div>
            <Link href="/login"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft size={14} /> Back to login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle size={15} className="shrink-0" />{error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-foreground">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" autoComplete="email"
                  className={cn(
                    'w-full rounded-xl border bg-background py-3 pl-10 pr-4 text-sm text-foreground',
                    'outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
                    error ? 'border-destructive' : 'border-border hover:border-muted-foreground/40',
                  )}
                />
              </div>
            </div>

            <button type="submit" disabled={status === 'loading'}
              className={cn(
                'w-full flex items-center justify-center gap-2.5 rounded-xl py-3 px-5',
                'text-sm font-semibold text-primary-foreground',
                'bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/25',
                'hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed',
              )}>
              {status === 'loading' ? <Loader2 size={17} className="animate-spin" /> : 'Send Reset Link'}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Remembered it?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Sign in →
              </Link>
            </p>
          </form>
        )}
      </AnimatePresence>
    </div>
  )
}
