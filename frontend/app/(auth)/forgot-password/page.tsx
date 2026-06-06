import type { Metadata } from 'next'
import AuthLayout from '@/app/components/auth/AuthLayout'
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm'

export const metadata: Metadata = {
  title: 'Forgot Password — TaskFlow Pro',
  description: 'Reset your TaskFlow Pro account password.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout mode="login">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
