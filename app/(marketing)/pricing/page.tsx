'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Check, X, Zap, ArrowRight, Star, Users, Shield,
  Rocket, HelpCircle, ChevronDown, ChevronUp,
  FolderKanban, CheckSquare, BarChart3, Bell, History, Lock,
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
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const cardIn = {
  hidden: { opacity: 0, y: 24 },
  show:  { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// ─────────────────────────────────────────────────────────────
// SECTION 1 — Hero
// ─────────────────────────────────────────────────────────────
function PricingHero({ isAnnual, setIsAnnual }: { isAnnual: boolean; setIsAnnual: (v: boolean) => void }) {
  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Grid bg */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)',
          backgroundSize: '52px 52px',
        }}
        aria-hidden="true"
      />
      {/* Glows */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full opacity-[0.09] dark:opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[500px] w-[500px] rounded-full opacity-[0.07] dark:opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
          <Zap size={13} className="text-primary" fill="currentColor" />
          <span className="text-xs font-semibold text-primary tracking-wide">Simple, Transparent Pricing</span>
        </motion.div>

        <motion.h1 initial="hidden" animate="show" custom={0.1} variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-5">
          Plans for Every{' '}
          <span className="bg-gradient-to-r from-tf-indigo via-primary to-tf-indigo bg-clip-text text-transparent">
            Team Size
          </span>
        </motion.h1>

        <motion.p initial="hidden" animate="show" custom={0.2} variants={fadeUp}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          Start free, grow at your own pace. No hidden fees, no credit card required to get started.
        </motion.p>

        {/* Billing toggle */}
        <motion.div initial="hidden" animate="show" custom={0.3} variants={fadeUp}
          className="inline-flex items-center gap-3 bg-card border border-border rounded-2xl p-1.5 shadow-sm">
          <button
            onClick={() => setIsAnnual(false)}
            className={cn(
              'px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              !isAnnual
                ? 'bg-gradient-to-r from-primary to-tf-indigo text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200',
              isAnnual
                ? 'bg-gradient-to-r from-primary to-tf-indigo text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Annual
            <span className={cn(
              'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all',
              isAnnual ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary',
            )}>
              Save 20%
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — Pricing Cards
// ─────────────────────────────────────────────────────────────
interface Plan {
  name: string
  badge?: string
  icon: React.ElementType
  color: string
  monthlyPrice: number | null
  annualPrice: number | null
  description: string
  cta: string
  ctaHref: string
  popular?: boolean
  features: string[]
  notIncluded?: string[]
}

const plans: Plan[] = [
  {
    name: 'Free',
    icon: Users,
    color: '#64748B',
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Perfect for individuals and small teams getting started.',
    cta: 'Get Started Free',
    ctaHref: '/login',
    features: [
      'Up to 3 projects',
      'Up to 10 tasks per project',
      '2 team members',
      'Basic task management',
      'Notification centre',
      'Mobile responsive',
      'Light & dark mode',
    ],
    notIncluded: [
      'Analytics dashboard',
      'Activity logs',
      'Role-based access',
      'Priority support',
    ],
  },
  {
    name: 'Pro',
    badge: 'Most Popular',
    icon: Rocket,
    color: '#4F46E5',
    monthlyPrice: 12,
    annualPrice: 10,
    description: 'For growing teams that need powerful collaboration tools.',
    cta: 'Start Pro Trial',
    ctaHref: '/login',
    popular: true,
    features: [
      'Unlimited projects',
      'Unlimited tasks',
      'Up to 25 team members',
      'Full task management',
      'Analytics dashboard',
      'Activity logs & audit trail',
      'Role-based access (Admin / Manager / Member)',
      'File attachments',
      'Smart notifications',
      'Priority email support',
      'Mobile responsive',
      'Light & dark mode',
    ],
  },
  {
    name: 'Enterprise',
    icon: Shield,
    color: '#10B981',
    monthlyPrice: 29,
    annualPrice: 23,
    description: 'For large organisations with advanced security and compliance needs.',
    cta: 'Contact Sales',
    ctaHref: '/contact',
    features: [
      'Everything in Pro',
      'Unlimited team members',
      'Dedicated account manager',
      'SSO & advanced auth',
      'Custom RBAC policies',
      'SLA guarantee (99.9% uptime)',
      'On-premise deployment option',
      'Advanced analytics & exports',
      'Custom integrations (API)',
      'Priority phone & chat support',
      'Security & compliance reports',
      'Custom onboarding',
    ],
  },
]

function PricingCards({ isAnnual }: { isAnnual: boolean }) {
  return (
    <section className="relative -mt-4 pb-20 md:pb-28 bg-background overflow-hidden" aria-labelledby="plans-heading">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="sr-only" id="plans-heading">Pricing Plans</h2>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-3 gap-4 lg:gap-6 items-stretch"
        >
          {plans.map((plan) => {
            const Icon  = plan.icon
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice

            return (
              <motion.div
                key={plan.name}
                variants={cardIn}
                whileHover={{ y: plan.popular ? -6 : -4 }}
                className={cn(
                  'relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300',
                  plan.popular
                    ? 'border-primary/50 bg-card shadow-2xl shadow-primary/15'
                    : 'border-border bg-card shadow-sm hover:shadow-lg',
                )}
              >
                {/* Popular gradient top bar */}
                {plan.popular && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-tf-indigo to-primary" />
                )}

                {/* Header */}
                <div className={cn(
                  'px-6 pt-7 pb-6',
                  plan.popular ? 'bg-primary/5' : '',
                )}>
                  {/* Badge */}
                  {plan.badge && (
                    <span className="inline-block mb-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary/15 text-primary">
                      {plan.badge}
                    </span>
                  )}

                  {/* Icon + name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: plan.color + '15' }}>
                      <Icon size={20} style={{ color: plan.color }} />
                    </div>
                    <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-2">
                    {price === 0 ? (
                      <span className="text-5xl font-extrabold text-foreground">Free</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold text-muted-foreground self-start mt-2">$</span>
                        <span className="text-5xl font-extrabold text-foreground">{price}</span>
                        <span className="text-sm text-muted-foreground mb-2">/ user / mo</span>
                      </>
                    )}
                  </div>

                  {/* Annual saving callout */}
                  {isAnnual && plan.monthlyPrice !== null && plan.monthlyPrice > 0 && (
                    <p className="text-xs text-primary font-semibold mb-3">
                      Save ${((plan.monthlyPrice - (plan.annualPrice ?? 0)) * 12).toFixed(0)} per user / year
                    </p>
                  )}
                  {!isAnnual && price === 0 && (
                    <p className="text-xs text-muted-foreground mb-3">Free forever · no credit card</p>
                  )}
                  {!isAnnual && price !== null && price > 0 && (
                    <p className="text-xs text-muted-foreground mb-3">Billed monthly · cancel anytime</p>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{plan.description}</p>

                  {/* CTA */}
                  <Link
                    href={plan.ctaHref}
                    className={cn(
                      'flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      plan.popular
                        ? 'bg-gradient-to-r from-primary to-tf-indigo text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5'
                        : 'border border-border bg-background text-foreground hover:bg-muted hover:-translate-y-0.5',
                    )}
                  >
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Divider */}
                <div className="h-px bg-border mx-6" />

                {/* Feature list */}
                <div className="px-6 py-6 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                    {plan.notIncluded ? "What's included" : 'Everything in Pro, plus'}
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check size={14} className="text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded?.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground/50 line-through">
                        <X size={14} className="mt-0.5 shrink-0 text-muted-foreground/40" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Note */}
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-xs text-muted-foreground"
        >
          All plans include SSL security, automatic backups, and uptime monitoring.
          Prices shown in USD. Tax may apply.
        </motion.p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — Feature Comparison Table
// ─────────────────────────────────────────────────────────────
type CellValue = boolean | string

interface CompareRow {
  feature: string
  free: CellValue
  pro: CellValue
  enterprise: CellValue
  icon: React.ElementType
}

const compareRows: CompareRow[] = [
  { feature: 'Projects',           free: '3',            pro: 'Unlimited',   enterprise: 'Unlimited',   icon: FolderKanban },
  { feature: 'Tasks per project',  free: '10',           pro: 'Unlimited',   enterprise: 'Unlimited',   icon: CheckSquare  },
  { feature: 'Team members',       free: '2',            pro: '25',          enterprise: 'Unlimited',   icon: Users        },
  { feature: 'Analytics dashboard',free: false,          pro: true,          enterprise: true,          icon: BarChart3    },
  { feature: 'Activity logs',      free: false,          pro: true,          enterprise: true,          icon: History      },
  { feature: 'Role-based access',  free: false,          pro: true,          enterprise: true,          icon: Lock         },
  { feature: 'Smart notifications',free: true,           pro: true,          enterprise: true,          icon: Bell         },
  { feature: 'File attachments',   free: false,          pro: true,          enterprise: true,          icon: FolderKanban },
  { feature: 'API access',         free: false,          pro: false,         enterprise: true,          icon: Zap          },
  { feature: 'SSO / Custom auth',  free: false,          pro: false,         enterprise: true,          icon: Shield       },
  { feature: 'Priority support',   free: 'Community',    pro: 'Email',       enterprise: 'Phone & Chat',icon: Users        },
  { feature: 'SLA guarantee',      free: false,          pro: false,         enterprise: '99.9% uptime',icon: Rocket       },
]

function Cell({ value, color }: { value: CellValue; color: string }) {
  if (typeof value === 'boolean') {
    return value
      ? <Check size={16} style={{ color }} className="mx-auto" />
      : <X size={14} className="mx-auto text-muted-foreground/30" />
  }
  return <span className="text-xs font-semibold text-foreground">{value}</span>
}

function ComparisonTable() {
  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden" aria-labelledby="compare-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Compare Plans
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="compare-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Side-by-Side{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Comparison
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground leading-relaxed">
            Every feature, every plan — laid out clearly so you can choose with confidence.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-5 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[40%]">
                    Feature
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Free
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider"
                    style={{ color: '#4F46E5' }}>
                    Pro ✦
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {compareRows.map((row) => {
                  const Icon = row.icon
                  return (
                    <tr key={row.feature} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5 text-sm font-medium text-foreground">
                          <Icon size={14} className="text-muted-foreground shrink-0" />
                          {row.feature}
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Cell value={row.free} color="#64748B" />
                      </td>
                      <td className="px-4 py-3.5 text-center bg-primary/[0.03]">
                        <Cell value={row.pro} color="#4F46E5" />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Cell value={row.enterprise} color="#10B981" />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — Testimonials / Social Proof
// ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "We switched from three separate tools to TaskFlow Pro and cut our project overhead by 40%. The analytics alone are worth it.",
    name: 'Sarah Chen',
    role: 'Engineering Manager',
    company: 'Horizon Labs',
    avatar: 'SC',
    color: '#4F46E5',
    plan: 'Pro',
    stars: 5,
  },
  {
    quote: "The free plan got us started, and when we hit 10 people we upgraded to Pro in minutes. Zero friction, incredible value.",
    name: 'Marcus Webb',
    role: 'Founder & CEO',
    company: 'Launchpad Studio',
    avatar: 'MW',
    color: '#10B981',
    plan: 'Pro',
    stars: 5,
  },
  {
    quote: "Enterprise was a no-brainer for us. SSO, custom RBAC, and a dedicated account manager sealed the deal. Our compliance team is happy.",
    name: 'Priya Nair',
    role: 'Head of Operations',
    company: 'NovaCorp',
    avatar: 'PN',
    color: '#F59E0B',
    plan: 'Enterprise',
    stars: 5,
  },
  {
    quote: "I started on the free tier as a solo dev. Within a week my team of 6 upgraded together. It just works.",
    name: 'James Okafor',
    role: 'Lead Developer',
    company: 'Stackwise',
    avatar: 'JO',
    color: '#EF4444',
    plan: 'Pro',
    stars: 5,
  },
  {
    quote: "Clean UI, dark mode, mobile-friendly — and the pricing is actually fair. Rare to find all three in one product.",
    name: 'Aiko Tanaka',
    role: 'Product Designer',
    company: 'Pixel & Co.',
    avatar: 'AT',
    color: '#8B5CF6',
    plan: 'Free',
    stars: 5,
  },
  {
    quote: "The RBAC system is exactly what we needed. Admins, managers, members — each sees only what they need to. Brilliant.",
    name: 'Daniel Frost',
    role: 'CTO',
    company: 'BuildFlow',
    avatar: 'DF',
    color: '#3B82F6',
    plan: 'Enterprise',
    stars: 5,
  },
]

function TestimonialsSection() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden" aria-labelledby="testimonials-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      {/* Glow */}
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Customer Stories
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              10,000+ Teams
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground">
            Real stories from real teams shipping real work.
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={cardIn}
              whileHover={{ y: -4 }}
              className="group flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200">
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={13} className="text-warning fill-warning" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-sm text-foreground leading-relaxed flex-1 mb-5">
                &ldquo;{t.quote}&rdquo;
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                <div className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                  style={{ backgroundColor: t.color }}>
                  {t.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{t.role} · {t.company}</div>
                </div>
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                  style={{ backgroundColor: t.color + '15', color: t.color }}>
                  {t.plan}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 5 — FAQ
// ─────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'Is the Free plan really free forever?',
    a: 'Yes. The Free plan has no time limit. You can use it indefinitely for small teams of up to 2 members with 3 projects. No credit card required.',
  },
  {
    q: 'Can I switch plans at any time?',
    a: 'Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your account settings. Upgrades take effect immediately; downgrades apply at the end of the billing period.',
  },
  {
    q: 'What happens to my data if I downgrade?',
    a: 'Your data is safe. If you exceed the Free plan limits after downgrading, your projects and tasks become read-only until you upgrade again or reduce usage.',
  },
  {
    q: 'Do you offer discounts for non-profits or education?',
    a: 'Yes! We offer a 50% discount for verified non-profits, open-source projects, and educational institutions. Contact our sales team to apply.',
  },
  {
    q: 'How does annual billing work?',
    a: 'Annual plans are billed once per year. You save 20% compared to monthly billing. You can still cancel, and we\'ll refund the unused months proportionally.',
  },
  {
    q: 'Is there a per-seat limit on the Enterprise plan?',
    a: 'No. The Enterprise plan supports unlimited team members, making it ideal for large organisations that need to onboard their entire workforce.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for Enterprise annual contracts.',
  },
  {
    q: 'Can I try Pro features before committing?',
    a: 'Yes. Every new account gets a 14-day Pro trial automatically. No credit card needed. After the trial, you\'ll drop to the Free plan unless you upgrade.',
  },
]

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden" aria-labelledby="faq-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-4">
            <HelpCircle size={13} className="text-primary" />
            <span className="text-xs font-semibold text-primary tracking-wide">FAQ</span>
          </motion.div>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Questions &{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Answers
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground">
            Everything you need to know before choosing a plan.
          </motion.p>
        </div>

        {/* Accordion */}
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={cardIn}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <span className="text-sm font-semibold text-foreground">{faq.q}</span>
                {open === i
                  ? <ChevronUp size={16} className="text-primary shrink-0" />
                  : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
              </button>
              {open === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="px-5 pb-5"
                >
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Still have questions? */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-10 text-center p-6 rounded-2xl border border-border bg-card shadow-sm">
          <p className="text-sm font-semibold text-foreground mb-1">Still have questions?</p>
          <p className="text-xs text-muted-foreground mb-4">Our team typically replies within a few hours.</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Contact Support
            <ArrowRight size={13} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 6 — CTA Banner
// ─────────────────────────────────────────────────────────────
function PricingCTA() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <div className="h-[500px] w-[900px] rounded-full opacity-[0.07] dark:opacity-[0.05] blur-3xl"
          style={{ background: 'radial-gradient(ellipse,rgb(var(--tf-indigo)),transparent 60%)' }} />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
          className="flex items-center justify-center gap-1 mb-6">
          {[1,2,3,4,5].map((i) => (
            <Star key={i} size={18} className="text-warning fill-warning" />
          ))}
          <span className="ml-2 text-sm font-semibold text-foreground">Rated 4.9/5 by 2,000+ teams</span>
        </motion.div>

        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
          Start Free Today —{' '}
          <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
            Upgrade When Ready
          </span>
        </motion.h2>

        <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
          className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          No credit card. No commitment. Just a better way to manage your team&apos;s work from day one.
        </motion.p>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.3} variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Get Started Free
            <ArrowRight size={15} />
          </Link>
          <Link href="/features"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-foreground border border-border bg-card hover:bg-muted hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Explore Features
          </Link>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.4} variants={fadeUp}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {['Free plan forever', '14-day Pro trial', 'No credit card needed', 'Cancel anytime'].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Check size={13} className="text-primary shrink-0" />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// Page export
// ─────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <>
      <PricingHero isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      <PricingCards isAnnual={isAnnual} />
      <ComparisonTable />
      <TestimonialsSection />
      <FAQSection />
      <PricingCTA />
    </>
  )
}
