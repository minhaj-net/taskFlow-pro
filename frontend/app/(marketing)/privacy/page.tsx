import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, ArrowLeft, Eye, Lock, Database, Bell, UserCheck, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy — TaskFlow Pro',
  description: 'Read the TaskFlow Pro Privacy Policy.',
}

const LAST_UPDATED = 'June 1, 2026'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
    
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            <Shield size={28} className="text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            <Clock size={13} /> Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
          <p className="text-sm text-foreground leading-relaxed">
            At <strong>TaskFlow Pro</strong>, your privacy matters deeply. This policy explains what data we collect,
            how we use it, and what rights you have over your information. We are committed to transparency and
            will never sell your data to third parties.
          </p>
        </div>

        {/* At a glance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Lock,     title: 'Encrypted',     desc: 'All data is encrypted at rest and in transit using AES-256.' },
            { icon: Eye,      title: 'Transparent',   desc: 'We clearly explain every type of data we collect and why.' },
            { icon: UserCheck,title: 'Your Control',  desc: 'You can export or delete your data at any time.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-2xl p-4 text-center space-y-2 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                <Icon size={18} className="text-primary" />
              </div>
              <div className="font-bold text-sm text-foreground">{title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        {/* Sections */}
        {[
          {
            icon: Database,
            title: '1. Information We Collect',
            body: null,
            list: [
              { label: 'Account Information', detail: 'Name, email address, department, and password (hashed) when you register.' },
              { label: 'Usage Data', detail: 'Actions you perform within the platform — creating tasks, updating projects, and team interactions.' },
              { label: 'Activity Logs', detail: 'Timestamped records of key actions for audit purposes within your organization.' },
              { label: 'File Attachments', detail: 'Files you upload to projects are stored securely and accessible only to project members.' },
              { label: 'Device & Browser Info', detail: 'Basic technical info (browser type, OS) to ensure compatibility and security.' },
            ],
          },
          {
            icon: Eye,
            title: '2. How We Use Your Data',
            body: null,
            list: [
              { label: 'Service Delivery', detail: 'To operate, maintain, and improve TaskFlow Pro features.' },
              { label: 'Notifications', detail: 'To send you relevant alerts about tasks, projects, and deadlines you are involved in.' },
              { label: 'Security', detail: 'To detect fraud, abuse, and protect the integrity of all user accounts.' },
              { label: 'Analytics', detail: 'Aggregated, anonymized usage statistics to guide product improvements.' },
              { label: 'Legal Compliance', detail: 'To comply with applicable laws and respond to legitimate legal requests.' },
            ],
          },
          {
            icon: Lock,
            title: '3. Data Security',
            body: `We take security seriously. All data is encrypted in transit using TLS 1.3 and at rest using
            AES-256 encryption. Passwords are hashed using bcrypt with a cost factor of 12 before storage —
            we never store plaintext passwords. Access to production systems is restricted to authorized
            personnel with multi-factor authentication. We conduct regular security audits and penetration testing.`,
            list: null,
          },
          {
            icon: UserCheck,
            title: '4. Your Rights',
            body: null,
            list: [
              { label: 'Access', detail: 'Request a copy of all personal data we hold about you.' },
              { label: 'Correction', detail: 'Update or correct inaccurate information via Settings.' },
              { label: 'Deletion', detail: 'Request deletion of your account and associated data.' },
              { label: 'Portability', detail: 'Export your data in a machine-readable format (JSON/CSV).' },
              { label: 'Opt-out', detail: 'Unsubscribe from non-essential notifications at any time.' },
            ],
          },
          {
            icon: Database,
            title: '5. Data Sharing',
            body: `We do not sell, trade, or rent your personal information to third parties. We may share
            data with: (a) service providers who help us operate the platform under strict data processing
            agreements; (b) law enforcement when required by valid legal process; (c) other parties with your
            explicit consent. All third-party providers are vetted and contractually obligated to protect your data.`,
            list: null,
          },
          {
            icon: Clock,
            title: '6. Data Retention',
            body: `We retain your personal data for as long as your account is active or as needed to provide
            services. Activity logs are kept for 12 months. File attachments are deleted within 30 days of
            account deletion. Backup copies may persist for up to 90 days. You can request early deletion
            at any time by contacting privacy@taskflowpro.com.`,
            list: null,
          },
          {
            icon: Bell,
            title: '7. Cookies',
            body: `TaskFlow Pro uses minimal, essential cookies only: session authentication tokens and theme
            preference. We do not use tracking cookies, advertising pixels, or third-party analytics cookies.
            You can disable cookies in your browser, though this may affect core functionality.`,
            list: null,
          },
          {
            icon: Shield,
            title: '8. Children\'s Privacy',
            body: `TaskFlow Pro is not directed at children under the age of 16. We do not knowingly collect
            personal information from children. If you become aware that a child has provided us with personal
            data, please contact us immediately at privacy@taskflowpro.com and we will promptly delete the information.`,
            list: null,
          },
          {
            icon: Clock,
            title: '9. Policy Changes',
            body: `We may update this Privacy Policy from time to time. We will notify you of material changes
            via email and in-app notification at least 14 days before they take effect. The "Last Updated" date
            at the top of this page reflects the most recent revision.`,
            list: null,
          },
          {
            icon: Shield,
            title: '10. Contact & DPO',
            body: `For privacy-related inquiries, to exercise your rights, or to contact our Data Protection Officer:
            Email: privacy@taskflowpro.com — We respond to all privacy requests within 30 days.`,
            list: null,
          },
        ].map(({ icon: Icon, title, body, list }) => (
          <div key={title} className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
              <Icon size={16} className="text-primary shrink-0" />
              {title}
            </h2>
            {body && <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>}
            {list && (
              <ul className="space-y-2.5">
                {list.map(({ label, detail }) => (
                  <li key={label} className="flex items-start gap-2.5 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span><strong className="text-foreground">{label}:</strong>{' '}
                      <span className="text-muted-foreground">{detail}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Footer CTA */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Questions about your privacy? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all">
              Create an Account
            </Link>
            <Link href="/terms"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
