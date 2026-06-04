'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Sarah Mitchell',
    position: 'Head of Engineering',
    company: 'Veritas Labs',
    avatar: 'SM',
    avatarColor: '#10B981',
    rating: 5,
    review:
      'TaskFlow Pro completely transformed how our engineering team ships features. The sprint boards and real-time updates cut our planning meetings in half. It\'s the one tool I recommend to every team lead.',
  },
  {
    name: 'James Okafor',
    position: 'Product Manager',
    company: 'Nexus Digital',
    avatar: 'JO',
    avatarColor: '#4F46E5',
    rating: 5,
    review:
      'I\'ve used Asana, Jira, and ClickUp. TaskFlow Pro beats them all on usability. The analytics dashboard alone is worth the switch — I finally have the visibility I need to keep stakeholders happy.',
  },
  {
    name: 'Priya Sharma',
    position: 'CTO',
    company: 'FlowStack',
    avatar: 'PS',
    avatarColor: '#3B82F6',
    rating: 5,
    review:
      'Onboarding the entire company took less than a day. The role-based permissions and SSO integration were seamless. Dark mode support is a nice touch — the team loves it.',
  },
  {
    name: 'Daniel Weber',
    position: 'Creative Director',
    company: 'Notion Studio',
    avatar: 'DW',
    avatarColor: '#8B5CF6',
    rating: 5,
    review:
      'As a design team we need both structure and flexibility. TaskFlow Pro gives us kanban boards for sprints, timelines for client delivery, and a beautiful UI that doesn\'t get in the way.',
  },
  {
    name: 'Aisha Nkrumah',
    position: 'Operations Lead',
    company: 'Kota Group',
    avatar: 'AN',
    avatarColor: '#F59E0B',
    rating: 5,
    review:
      'The notification system is incredibly smart — no more notification fatigue. I only get alerted on what actually needs my attention. Customer support is also top-tier, always responsive.',
  },
  {
    name: 'Lucas Fernandez',
    position: 'Senior Developer',
    company: 'Buildware',
    avatar: 'LF',
    avatarColor: '#EF4444',
    rating: 5,
    review:
      'The API and webhook support made it trivial to integrate TaskFlow Pro into our CI/CD pipeline. Deployments now automatically create tasks and update project status. Game changer.',
  },
]

// ── Star row ──────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < count ? 'text-warning fill-warning' : 'text-muted-foreground'}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────
function TestimonialCard({
  t,
  index,
}: {
  t: typeof testimonials[0]
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      whileHover={{ y: -6, scale: 1.015 }}
      className={cn(
        'group relative flex flex-col gap-5 p-6 rounded-2xl overflow-hidden cursor-default',
        'bg-card border border-border',
        'shadow-sm hover:shadow-xl transition-all duration-300',
      )}
      aria-label={`Testimonial from ${t.name}, ${t.position} at ${t.company}`}
    >
      {/* Quote icon */}
      <div
        className="absolute -top-3 -right-3 h-16 w-16 rounded-full flex items-center justify-center opacity-[0.06]"
        style={{ backgroundColor: t.avatarColor }}
        aria-hidden="true"
      >
        <Quote size={28} style={{ color: t.avatarColor }} />
      </div>

      {/* Hover top border */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,${t.avatarColor}00,${t.avatarColor},${t.avatarColor}00)` }}
        aria-hidden="true"
      />

      {/* Stars */}
      <Stars count={t.rating} />

      {/* Review text */}
      <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
        &ldquo;{t.review}&rdquo;
      </blockquote>

      {/* Profile */}
      <div className="flex items-center gap-3 pt-2 border-t border-border">
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-border"
          style={{ backgroundColor: t.avatarColor }}
          aria-hidden="true"
        >
          {t.avatar}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">{t.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {t.position} · {t.company}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

// ── Section ───────────────────────────────────────────────────
export default function TestimonialsSection() {
  const avgRating = (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)

  return (
    <section
      className="relative py-20 md:py-32 bg-background overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Glow */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Customer Stories
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }}
            id="testimonials-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5"
          >
            Loved By Teams{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Worldwide
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
          >
            See what teams are saying about TaskFlow Pro.
          </motion.p>

          {/* Aggregate rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border bg-card shadow-sm"
          >
            <div className="flex gap-0.5" aria-label="Average rating">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={14} className="text-warning fill-warning" aria-hidden="true" />
              ))}
            </div>
            <span className="text-sm font-bold text-foreground">{avgRating}/5</span>
            <span className="text-xs text-muted-foreground">from {testimonials.length * 1667}+ reviews</span>
          </motion.div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          role="list"
        >
          {testimonials.map((t, i) => (
            <div key={t.name} role="listitem">
              <TestimonialCard t={t} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
