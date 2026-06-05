'use client'

import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/app/components/ui/accordion'
import { cn } from '@/lib/utils'

// ── Data ──────────────────────────────────────────────────────
const faqs = [
  {
    q: 'What is TaskFlow Pro?',
    a: 'TaskFlow Pro is a smart project and task collaboration platform built for modern teams. It gives you everything you need — project boards, task management, team collaboration, analytics, and more — in one beautifully designed app.',
  },
  {
    q: 'Can I manage multiple projects at the same time?',
    a: 'Absolutely. TaskFlow Pro is built for multi-project workflows. You can switch between projects instantly, get a cross-project overview on your home dashboard, and filter tasks and reports by project or team.',
  },
  {
    q: 'How does task assignment work?',
    a: 'You can assign any task to one or more team members with a single click. Assignees receive instant notifications, the task appears in their personal queue, and you can track progress in real time from the project board.',
  },
  {
    q: 'Does TaskFlow Pro support role-based access control?',
    a: 'Yes. You can define custom roles — Owner, Admin, Member, Guest — each with granular permissions. Project-level access control means you can share specific boards with clients or contractors without exposing your entire workspace.',
  },
  {
    q: 'Can I upload files and attachments to tasks?',
    a: 'Yes, you can attach files directly to tasks, comments, or projects. We support all file types up to 250 MB per upload, with integrations for Google Drive, Dropbox, and OneDrive coming in Q3.',
  },
  {
    q: 'Can team members comment and collaborate on tasks?',
    a: 'Definitely. Every task has a threaded comment section with @mention support, emoji reactions, and the ability to quote previous messages. You can also leave inline comments on uploaded files.',
  },
  {
    q: 'Is dark mode supported?',
    a: 'Yes — dark mode is a first-class feature. TaskFlow Pro supports system-preference detection (automatically matches your OS setting), as well as a manual toggle so you can switch any time. The theme persists across sessions.',
  },
  {
    q: 'Can I use TaskFlow Pro on mobile devices?',
    a: 'Yes. The web app is fully responsive and optimised for mobile browsers from 320 px wide. Native iOS and Android apps with offline support are currently in beta and will be generally available soon.',
  },
]

// ── Section ───────────────────────────────────────────────────
export default function FAQSection() {
  return (
    <section
      className="relative py-20 md:py-32 bg-muted/30 overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Separators */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />

      {/* Bg glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.p
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3"
          >
            Got Questions?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.08 }}
            id="faq-heading"
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-5"
          >
            Frequently Asked{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Questions
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
            className="text-base text-muted-foreground leading-relaxed"
          >
            Can&apos;t find the answer you&apos;re looking for?{' '}
            <a
              href="/contact"
              className="text-primary font-medium underline underline-offset-2 hover:text-tf-indigo transition-colors"
            >
              Reach out to our team.
            </a>
          </motion.p>
        </div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden"
        >
          <Accordion type="single" collapsible className="divide-y divide-border">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="px-6 border-none"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-semibold text-foreground py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
