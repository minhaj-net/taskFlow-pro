'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap,
  Facebook,
  Linkedin,
  Twitter,
  Github,
  ArrowUpRight,
  Mail,
  MapPin,
  Heart,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Footer link data ──────────────────────────────────────────
const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const resourceLinks = [
  { label: 'Documentation', href: '/docs' },
  { label: 'Help Center', href: '/help' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: Facebook,
    color: '#1877F2',
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: Linkedin,
    color: '#0A66C2',
  },
  {
    label: 'Twitter / X',
    href: 'https://twitter.com',
    icon: Twitter,
    color: '#1DA1F2',
  },
  {
    label: 'GitHub',
    href: 'https://github.com',
    icon: Github,
    color: '#24292E',
  },
]

// ── Link column ───────────────────────────────────────────────
function FooterLinkGroup({
  heading,
  links,
}: {
  heading: string
  links: { label: string; href: string }[]
}) {
  return (
    <div>
      <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-5">
        {heading}
      </h3>
      <ul className="space-y-3" role="list">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              className={cn(
                'group inline-flex items-center gap-1 text-sm text-muted-foreground',
                'hover:text-foreground transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded',
              )}
            >
              {label}
              <ArrowUpRight
                size={12}
                className="opacity-0 -translate-x-1 group-hover:opacity-60 group-hover:translate-x-0 transition-all duration-150"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ── Main footer ───────────────────────────────────────────────
export default function Footer() {
  const currentYear = 2026

  return (
    <footer
      className="relative bg-card border-t border-border overflow-hidden"
      aria-label="Site footer"
    >
      {/* Top decorative gradient line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg,transparent,rgb(var(--tf-emerald)),rgb(var(--tf-indigo)),transparent)',
        }}
        aria-hidden="true"
      />

      {/* Background glow */}
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 -translate-x-1/2 h-[400px] w-[800px] rounded-full opacity-[0.04] blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse,rgb(var(--tf-emerald)),transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            {/* Logo */}
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 mb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
              aria-label="TaskFlow Pro — Home"
            >
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center shadow-md shadow-primary/30 group-hover:shadow-lg group-hover:shadow-primary/40 transition-shadow duration-200">
                <Zap size={18} className="text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-base font-bold text-foreground">
                TaskFlow{' '}
                <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
                  Pro
                </span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-[260px]">
              A premium project and task collaboration platform built for modern, high-performing teams.
            </p>

            {/* Contact snippets */}
            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail size={13} className="text-primary shrink-0" aria-hidden="true" />
                <span>hello@taskflowpro.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin size={13} className="text-primary shrink-0" aria-hidden="true" />
                <span>San Francisco, CA 94107</span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2" role="list" aria-label="Social media links">
              {socialLinks.map(({ label, href, icon: Icon, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  role="listitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.12, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    'h-9 w-9 rounded-xl flex items-center justify-center',
                    'bg-muted border border-border',
                    'text-muted-foreground hover:text-foreground',
                    'hover:bg-accent hover:border-primary/30',
                    'transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <Icon size={15} aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FooterLinkGroup heading="Quick Links" links={quickLinks} />
          </motion.div>

          {/* Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <FooterLinkGroup heading="Resources" links={resourceLinks} />
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.26 }}
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-5">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Get the latest features and productivity tips delivered to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-2.5"
              aria-label="Newsletter signup"
            >
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address for newsletter"
                  className={cn(
                    'w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5',
                    'text-sm text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
                    'transition-all duration-150',
                  )}
                />
              </div>
              <button
                type="submit"
                className={cn(
                  'w-full rounded-xl py-2.5 px-4',
                  'text-sm font-semibold text-primary-foreground',
                  'bg-gradient-to-r from-primary to-tf-indigo',
                  'shadow-md shadow-primary/20',
                  'hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5',
                  'active:translate-y-0 transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                )}
              >
                Subscribe
              </button>
            </form>

            {/* Mini trust badges */}
            <div className="mt-5 flex flex-wrap gap-2">
              {['No spam', 'Unsubscribe anytime', 'Free forever'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted border border-border rounded-full px-2.5 py-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Bottom bar ────────────────────────────────── */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            © {currentYear} TaskFlow Pro. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Made with{' '}
            <Heart
              size={12}
              className="text-danger fill-danger"
              aria-hidden="true"
            />{' '}
            for productive teams worldwide.
          </p>

          {/* Bottom nav */}
          <nav aria-label="Legal navigation" className="flex items-center gap-4">
            {[
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
              { label: 'Cookies', href: '/cookies' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
