import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ArrowLeft, Shield, AlertCircle, Scale, Clock, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service — TaskFlow Pro',
  description: 'Read the TaskFlow Pro Terms of Service.',
}

const LAST_UPDATED = 'June 1, 2026'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
    

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-10">

        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-2">
            <Scale size={28} className="text-primary" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground text-sm flex items-center justify-center gap-1.5">
            <Clock size={13} /> Last updated: {LAST_UPDATED}
          </p>
        </div>

        {/* Intro */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
          <p className="text-sm text-foreground leading-relaxed">
            Welcome to <strong>TaskFlow Pro</strong>. By accessing or using our platform, you agree to be bound by
            these Terms of Service. Please read them carefully before using the service.
          </p>
        </div>

        {/* Sections */}
        {[
          {
            icon: FileText,
            title: '1. Acceptance of Terms',
            body: `By creating an account or using TaskFlow Pro in any way, you confirm that you are at least 16 years
            old, have read and understood these Terms, and agree to be legally bound by them. If you are using
            TaskFlow Pro on behalf of an organization, you represent that you have authority to bind that organization.`,
          },
          {
            icon: Shield,
            title: '2. Use of the Service',
            body: `TaskFlow Pro grants you a limited, non-exclusive, non-transferable license to access and use the
            platform for your internal business purposes. You agree not to: (a) copy, modify, or distribute any part
            of the service; (b) reverse-engineer the platform; (c) use the service for any unlawful purpose;
            (d) attempt to gain unauthorized access to any system or network connected to TaskFlow Pro.`,
          },
          {
            icon: Shield,
            title: '3. Your Account',
            body: `You are responsible for maintaining the confidentiality of your login credentials. You agree to
            notify us immediately of any unauthorized use of your account. TaskFlow Pro will not be liable for any
            loss or damage arising from your failure to protect your account credentials. You are fully responsible
            for all activities that occur under your account.`,
          },
          {
            icon: FileText,
            title: '4. Content Ownership',
            body: `You retain all ownership rights to the content you create, upload, or submit through TaskFlow Pro.
            By using the service, you grant TaskFlow Pro a limited license to store, display, and process your
            content solely to provide the service. We do not sell or share your project data with third parties.`,
          },
          {
            icon: AlertCircle,
            title: '5. Prohibited Activities',
            body: `You agree not to use TaskFlow Pro to: upload malicious code or malware; harass, abuse, or harm
            other users; scrape or extract data without written permission; impersonate any person or organization;
            violate any applicable local, state, national, or international law or regulation.`,
          },
          {
            icon: FileText,
            title: '6. Service Availability',
            body: `We strive to maintain 99.9% uptime but do not guarantee uninterrupted access. TaskFlow Pro
            may be temporarily unavailable for scheduled maintenance or due to circumstances beyond our control.
            We will provide advance notice of planned maintenance when possible.`,
          },
          {
            icon: Scale,
            title: '7. Limitation of Liability',
            body: `To the maximum extent permitted by law, TaskFlow Pro shall not be liable for any indirect,
            incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill,
            arising from your use of the service. Our total liability shall not exceed the amount you paid us
            in the 12 months prior to the claim.`,
          },
          {
            icon: FileText,
            title: '8. Termination',
            body: `Either party may terminate this agreement at any time. You may delete your account through the
            Settings page. We may suspend or terminate your access if you violate these Terms. Upon termination,
            your right to use the service immediately ceases, though we may retain data as required by law.`,
          },
          {
            icon: Clock,
            title: '9. Changes to Terms',
            body: `We reserve the right to modify these Terms at any time. We will notify you of significant changes
            via email or a prominent notice in the application. Continued use of the service after changes constitutes
            your acceptance of the new Terms.`,
          },
          {
            icon: Mail,
            title: '10. Contact Us',
            body: `If you have any questions about these Terms of Service, please contact us at:
            legal@taskflowpro.com. We aim to respond to all inquiries within 5 business days.`,
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-sm">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2.5">
              <Icon size={16} className="text-primary shrink-0" />
              {title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </div>
        ))}

        {/* Footer CTA */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            By using TaskFlow Pro you agree to these terms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all">
              Create an Account
            </Link>
            <Link href="/privacy"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
