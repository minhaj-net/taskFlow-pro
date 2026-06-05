'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Zap, ArrowRight, Mail, MessageSquare, Phone,
  MapPin, Clock, Twitter, Github, Linkedin,
  CheckCircle2, AlertCircle, Send, Users, Rocket, Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Animation helpers ────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (d = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: d },
  }),
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const cardIn  = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// ─────────────────────────────────────────────────────────────
// SECTION 1 — Hero
// ─────────────────────────────────────────────────────────────
function ContactHero() {
  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Grid bg */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)', backgroundSize: '52px 52px' }}
        aria-hidden="true" />
      {/* Glows */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full opacity-[0.09] dark:opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[500px] w-[500px] rounded-full opacity-[0.07] dark:opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
          <MessageSquare size={13} className="text-primary" />
          <span className="text-xs font-semibold text-primary tracking-wide">We&apos;d Love to Hear From You</span>
        </motion.div>

        <motion.h1 initial="hidden" animate="show" custom={0.1} variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
          Let&apos;s{' '}
          <span className="bg-gradient-to-r from-tf-indigo via-primary to-tf-indigo bg-clip-text text-transparent">
            Start a Conversation
          </span>
        </motion.h1>

        <motion.p initial="hidden" animate="show" custom={0.2} variants={fadeUp}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
          Have a question, a partnership idea, or just want to say hello?
          Our team typically responds within a few hours.
        </motion.p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — Contact form + info side by side
// ─────────────────────────────────────────────────────────────
type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

function ContactFormSection() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [reason, setReason]   = useState('general')
  const [status, setStatus]   = useState<FormStatus>('idle')
  const [errors, setErrors]   = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim())            e.name    = 'Name is required.'
    if (!email.trim())           e.email   = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email.'
    if (!subject.trim())         e.subject = 'Subject is required.'
    if (!message.trim())         e.message = 'Message is required.'
    else if (message.length < 20) e.message = 'Message must be at least 20 characters.'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setStatus('submitting')
    // Simulate async send
    await new Promise((r) => setTimeout(r, 1400))
    setStatus('success')
    setName(''); setEmail(''); setSubject(''); setMessage(''); setReason('general')
  }

  const inputCls = (field: string) => cn(
    'w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground',
    'placeholder:text-muted-foreground/60 outline-none transition-all',
    'focus:ring-2 focus:ring-ring focus:border-transparent',
    errors[field] ? 'border-destructive ring-1 ring-destructive/30' : 'border-border',
  )

  return (
    <section className="relative pb-20 md:pb-28 bg-background overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-start">

          {/* ── LEFT: Form (3 cols) ─────────────────────── */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="lg:col-span-3">
            <motion.div variants={cardIn}
              className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">

              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-12 gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Message Sent!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                    Thanks for reaching out. We&apos;ll get back to you within a few hours.
                  </p>
                  <button onClick={() => setStatus('idle')}
                    className="mt-2 text-sm font-semibold text-primary hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div>
                    <h2 className="text-xl font-extrabold text-foreground mb-1">Send Us a Message</h2>
                    <p className="text-sm text-muted-foreground">Fill in the form and we&apos;ll be in touch shortly.</p>
                  </div>

                  {/* Reason */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">I&apos;m reaching out about…</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: 'general',     label: 'General' },
                        { value: 'sales',       label: 'Sales / Pricing' },
                        { value: 'support',     label: 'Support' },
                        { value: 'partnership', label: 'Partnership' },
                        { value: 'feedback',    label: 'Feedback' },
                      ].map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setReason(r.value)}
                          className={cn(
                            'px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150',
                            reason === r.value
                              ? 'border-primary/50 bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
                          )}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="cf-name" className="text-xs font-semibold text-foreground">Full Name</label>
                      <input id="cf-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan" className={inputCls('name')} />
                      {errors.name && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={10} />{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="cf-email" className="text-xs font-semibold text-foreground">Email Address</label>
                      <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com" className={inputCls('email')} />
                      {errors.email && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={10} />{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="cf-subject" className="text-xs font-semibold text-foreground">Subject</label>
                    <input id="cf-subject" type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
                      placeholder="How can we help?" className={inputCls('subject')} />
                    {errors.subject && <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={10} />{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="cf-message" className="text-xs font-semibold text-foreground">Message</label>
                    <textarea id="cf-message" value={message} onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us what's on your mind…" rows={5}
                      className={cn(inputCls('message'), 'resize-none')} />
                    <div className="flex items-center justify-between">
                      {errors.message
                        ? <p className="text-[10px] text-destructive flex items-center gap-1"><AlertCircle size={10} />{errors.message}</p>
                        : <span />}
                      <span className={cn('text-[10px]', message.length < 20 ? 'text-muted-foreground' : 'text-primary')}>
                        {message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className={cn(
                      'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-primary-foreground',
                      'bg-gradient-to-r from-primary to-tf-indigo shadow-md shadow-primary/20',
                      'hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      'disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0',
                    )}
                  >
                    {status === 'submitting' ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Contact info (2 cols) ─────────────── */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="lg:col-span-2 space-y-5">

            {/* Contact channels */}
            {[
              { icon: Mail,    color: '#4F46E5', title: 'Email Us',         desc: 'hello@taskflowpro.com', sub: 'We reply within 4 hours' },
              { icon: MessageSquare, color: '#10B981', title: 'Live Chat', desc: 'Available in-app',      sub: 'Mon–Fri, 9am–6pm UTC' },
              { icon: Phone,   color: '#F59E0B', title: 'Phone',            desc: '+1 (555) 000-0000',    sub: 'Enterprise customers only' },
            ].map((ch) => {
              const Icon = ch.icon
              return (
                <motion.div key={ch.title} variants={cardIn}
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative">
                  <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg,${ch.color}00,${ch.color},${ch.color}00)` }} />
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: ch.color + '15' }}>
                    <Icon size={18} style={{ color: ch.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground mb-0.5">{ch.title}</p>
                    <p className="text-sm font-semibold text-foreground">{ch.desc}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{ch.sub}</p>
                  </div>
                </motion.div>
              )
            })}

            {/* Office info */}
            <motion.div variants={cardIn}
              className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground mb-3">
                <MapPin size={14} className="text-primary" />
                Our Office
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                100 Innovation Drive, Suite 400<br />
                San Francisco, CA 94105<br />
                United States
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <Clock size={12} className="shrink-0" />
                Mon–Fri, 9:00am – 6:00pm PST
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div variants={cardIn}
              className="p-5 rounded-2xl border border-border bg-card shadow-sm">
              <p className="text-xs font-bold text-foreground mb-4">Follow Us</p>
              <div className="flex gap-2">
                {[
                  { icon: Twitter,  label: 'Twitter',  color: '#4F46E5', href: '#' },
                  { icon: Github,   label: 'GitHub',   color: '#6B7280', href: '#' },
                  { icon: Linkedin, label: 'LinkedIn', color: '#0A66C2', href: '#' },
                  { icon: Mail,     label: 'Email',    color: '#10B981', href: '#' },
                ].map((s) => {
                  const Icon = s.icon
                  return (
                    <a key={s.label} href={s.href}
                      className="h-9 w-9 rounded-xl flex items-center justify-center border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted hover:-translate-y-0.5 transition-all duration-200"
                      aria-label={s.label}>
                      <Icon size={15} />
                    </a>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — Support options cards
// ─────────────────────────────────────────────────────────────
const supportOptions = [
  {
    icon: Users,    color: '#4F46E5',
    title: 'Community Support',
    desc:  'Browse our community forums for answers, tips, and discussions from fellow TaskFlow Pro users.',
    cta: 'Join Community', href: '#',
  },
  {
    icon: MessageSquare, color: '#10B981',
    title: 'Documentation',
    desc:  'Find detailed guides, API references, and how-to tutorials in our comprehensive docs centre.',
    cta: 'Read the Docs', href: '#',
  },
  {
    icon: Rocket,   color: '#F59E0B',
    title: 'Enterprise Support',
    desc:  'On the Enterprise plan? You get a dedicated account manager and a priority SLA response time.',
    cta: 'Talk to Sales', href: '/pricing',
  },
  {
    icon: Shield,   color: '#EF4444',
    title: 'Security & Privacy',
    desc:  'To report a vulnerability or ask about our privacy practices, reach our security team directly.',
    cta: 'Security Contact', href: '#',
  },
]

function SupportSection() {
  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden" aria-labelledby="support-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            More Ways to Get Help
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="support-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            We&apos;re Here{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Every Step
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            No matter your plan, you&apos;ll always have a way to get help when you need it.
          </motion.p>
        </div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {supportOptions.map((opt) => {
            const Icon = opt.icon
            return (
              <motion.div key={opt.title} variants={cardIn}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg,${opt.color}00,${opt.color},${opt.color}00)` }} />
                <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: opt.color + '15' }}>
                  <Icon size={20} style={{ color: opt.color }} />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-2">{opt.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-5">{opt.desc}</p>
                <Link href={opt.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                  style={{ color: opt.color }}>
                  {opt.cta}
                  <ArrowRight size={11} />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — CTA
// ─────────────────────────────────────────────────────────────
function ContactCTA() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[500px] w-[900px] rounded-full opacity-[0.07] dark:opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-indigo)),transparent 60%)' }} />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
          Ready to Get{' '}
          <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
            Started?
          </span>
        </motion.h2>

        <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
          className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          Try TaskFlow Pro free for 14 days. No credit card. No commitment. Just great work.
        </motion.p>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Start Free Trial
            <ArrowRight size={15} />
          </Link>
          <Link href="/about"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-foreground border border-border bg-card hover:bg-muted hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Learn About Us
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactFormSection />
      <SupportSection />
      <ContactCTA />
    </>
  )
}
