'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Zap, ArrowRight, Star, Users, FolderKanban, CheckSquare,
  Heart, Target, Globe, Shield, Rocket, TrendingUp,
  Github, Twitter, Linkedin, Mail,
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
function AboutHero() {
  return (
    <section className="relative py-24 md:py-36 bg-background overflow-hidden">
      {/* Grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.05]"
        style={{ backgroundImage: 'linear-gradient(rgb(var(--foreground)) 1px,transparent 1px),linear-gradient(to right,rgb(var(--foreground)) 1px,transparent 1px)', backgroundSize: '52px 52px' }}
        aria-hidden="true" />
      {/* Glows */}
      <div className="pointer-events-none absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full opacity-[0.09] dark:opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-[500px] w-[500px] rounded-full opacity-[0.07] dark:opacity-[0.05] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-emerald)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
          <Heart size={13} className="text-primary" fill="currentColor" />
          <span className="text-xs font-semibold text-primary tracking-wide">Our Story</span>
        </motion.div>

        <motion.h1 initial="hidden" animate="show" custom={0.1} variants={fadeUp}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
          Built by a Team That{' '}
          <span className="bg-gradient-to-r from-tf-indigo via-primary to-tf-indigo bg-clip-text text-transparent">
            Hated Bad Tools
          </span>
        </motion.h1>

        <motion.p initial="hidden" animate="show" custom={0.2} variants={fadeUp}
          className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl mx-auto">
          TaskFlow Pro was born from frustration — scattered tasks, missed deadlines, and a dozen tabs open at once.
          We built the tool we always wished existed.
        </motion.p>

        {/* Stats */}
        <motion.div initial="hidden" animate="show" custom={0.3} variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '2021', label: 'Founded' },
            { value: '10K+', label: 'Teams' },
            { value: '48K+', label: 'Tasks Done' },
            { value: '4.9★', label: 'Rating' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold text-foreground mb-1">{s.value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 2 — Mission & Vision (split layout)
// ─────────────────────────────────────────────────────────────
function MissionSection() {
  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* Left — story text */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={stagger}>
            <motion.span variants={cardIn}
              className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary mb-5">
              Why We Exist
            </motion.span>
            <motion.h2 variants={cardIn}
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-6 leading-snug">
              A Single Platform Where{' '}
              <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
                Great Work Happens
              </span>
            </motion.h2>
            <motion.p variants={cardIn} className="text-base text-muted-foreground leading-relaxed mb-5">
              In 2021, our founding team was juggling Notion for docs, Trello for tasks, Slack for updates, and Excel for reports.
              Every project felt like herding cats. So we stopped complaining and started building.
            </motion.p>
            <motion.p variants={cardIn} className="text-base text-muted-foreground leading-relaxed mb-8">
              TaskFlow Pro is the result — a clean, fast, role-aware collaboration platform that gives every team member
              exactly what they need to do great work without the noise.
            </motion.p>
            <motion.div variants={cardIn}>
              <Link href="/features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                Explore the Platform
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right — mission/vision cards */}
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={stagger}
            className="space-y-4">
            {[
              {
                icon: Target,
                color: '#4F46E5',
                title: 'Our Mission',
                desc: 'To eliminate the friction between great ideas and great execution — giving every team one unified place to plan, collaborate, and deliver.',
              },
              {
                icon: Globe,
                color: '#10B981',
                title: 'Our Vision',
                desc: 'A world where every team — from two-person startups to global enterprises — ships faster, wastes less, and works more meaningfully.',
              },
              {
                icon: Heart,
                color: '#EF4444',
                title: 'Our Values',
                desc: 'Transparency, simplicity, and respect for the people using our product. We build what we would want to use ourselves.',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <motion.div key={item.title} variants={cardIn}
                  className="group flex items-start gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden relative">
                  <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg,${item.color}00,${item.color},${item.color}00)` }} />
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.color + '15' }}>
                    <Icon size={18} style={{ color: item.color }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 3 — Team
// ─────────────────────────────────────────────────────────────
const team = [
  { name: 'Alex Morgan',   role: 'Co-founder & CEO',          color: '#4F46E5', avatar: 'AM', dept: 'Leadership', bio: 'Ex-Google PM. Obsessed with product simplicity and team happiness.', twitter: '#', linkedin: '#' },
  { name: 'Jordan Kim',    role: 'Co-founder & CTO',          color: '#10B981', avatar: 'JK', dept: 'Engineering', bio: 'Full-stack architect who has shipped products used by millions.', github: '#', linkedin: '#' },
  { name: 'Sam Rivera',    role: 'Head of Design',            color: '#F59E0B', avatar: 'SR', dept: 'Design', bio: 'Pixel perfectionist. Formerly at Linear and Figma.', twitter: '#', linkedin: '#' },
  { name: 'Taylor Lee',    role: 'Head of Engineering',       color: '#EF4444', avatar: 'TL', dept: 'Engineering', bio: 'Infrastructure nerd. Keeps TaskFlow Pro at 99.9% uptime.', github: '#', linkedin: '#' },
  { name: 'Morgan Patel',  role: 'Head of Customer Success',  color: '#8B5CF6', avatar: 'MP', dept: 'Success', bio: 'Turned 200 unhappy users into our loudest advocates.', twitter: '#', linkedin: '#' },
  { name: 'Casey Nguyen',  role: 'Lead Product Designer',     color: '#3B82F6', avatar: 'CN', dept: 'Design', bio: 'Obsesses over interaction details that most people never notice — but always feel.', twitter: '#', linkedin: '#' },
]

function TeamSection() {
  return (
    <section className="relative py-20 md:py-28 bg-background overflow-hidden" aria-labelledby="team-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="pointer-events-none absolute top-0 right-0 h-[400px] w-[400px] rounded-full opacity-[0.06] blur-3xl"
        style={{ background: 'radial-gradient(circle,rgb(var(--tf-indigo)),transparent 70%)' }} aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            The People Behind It
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="team-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Meet the{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Team
            </span>
          </motion.h2>
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
            className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A small, focused team with deep experience in product, engineering, and design.
          </motion.p>
        </div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {team.map((member) => (
            <motion.div key={member.name} variants={cardIn}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Top accent */}
              <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg,${member.color}00,${member.color},${member.color}00)` }} />
              {/* Corner glow */}
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
                style={{ backgroundColor: member.color + '20' }} />

              {/* Avatar + info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center font-extrabold text-lg text-white shrink-0 shadow-md"
                  style={{ background: `linear-gradient(135deg,${member.color},${member.color}bb)` }}>
                  {member.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{member.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: member.color + '15', color: member.color }}>
                    {member.dept}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{member.bio}</p>

              {/* Social links */}
              <div className="flex items-center gap-2 pt-3 border-t border-border/60">
                {member.twitter && (
                  <a href={member.twitter} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Twitter">
                    <Twitter size={13} />
                  </a>
                )}
                {member.github && (
                  <a href={member.github} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="GitHub">
                    <Github size={13} />
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="LinkedIn">
                    <Linkedin size={13} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 4 — Company values / culture
// ─────────────────────────────────────────────────────────────
const values = [
  { icon: Shield,    color: '#4F46E5', title: 'Security First',      desc: 'We treat your data like our own. Every feature is built with privacy and security as a constraint, not an afterthought.' },
  { icon: Rocket,    color: '#10B981', title: 'Speed Matters',       desc: 'Slow tools kill momentum. Every interaction in TaskFlow Pro is optimised to be instant and satisfying.' },
  { icon: Users,     color: '#F59E0B', title: 'Team Empowerment',    desc: 'We design for entire teams, not just power users. Everyone from intern to CTO should feel at home.' },
  { icon: TrendingUp,color: '#EF4444', title: 'Always Improving',    desc: 'We ship weekly. We listen to every piece of feedback. The product you use today is always the best version yet.' },
]

function ValuesSection() {
  return (
    <section className="relative py-20 md:py-28 bg-muted/30 overflow-hidden" aria-labelledby="values-heading">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            What Drives Us
          </motion.p>
          <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
            id="values-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Our Core{' '}
            <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
              Values
            </span>
          </motion.h2>
        </div>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => {
            const Icon = v.icon
            return (
              <motion.div key={v.title} variants={cardIn}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg,${v.color}00,${v.color},${v.color}00)` }} />
                <div className="h-11 w-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: v.color + '15' }}>
                  <Icon size={20} style={{ color: v.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-2">{v.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SECTION 5 — CTA
// ─────────────────────────────────────────────────────────────
function AboutCTA() {
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
          <span className="ml-2 text-sm font-semibold text-foreground">Loved by 10,000+ teams worldwide</span>
        </motion.div>

        <motion.h2 initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.1} variants={fadeUp}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
          Join Us in Building{' '}
          <span className="bg-gradient-to-r from-primary to-tf-indigo bg-clip-text text-transparent">
            Better Work
          </span>
        </motion.h2>

        <motion.p initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.2} variants={fadeUp}
          className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
          Whether you&apos;re a team of 2 or 200, TaskFlow Pro grows with you. Start free today.
        </motion.p>

        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} custom={0.3} variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            Get Started Free
            <ArrowRight size={15} />
          </Link>
          <Link href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold text-foreground border border-border bg-card hover:bg-muted hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-auto justify-center">
            <Mail size={14} />
            Get in Touch
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionSection />
      <TeamSection />
      <ValuesSection />
      <AboutCTA />
    </>
  )
}
