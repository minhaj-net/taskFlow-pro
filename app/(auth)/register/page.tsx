import type { Metadata } from 'next'
import AuthLayout from '@/app/components/auth/AuthLayout'
import RegisterForm from '@/app/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Create Account — TaskFlow Pro',
  description: 'Create your free TaskFlow Pro account.',
}

export default function RegisterPage() {
  return (
    <AuthLayout mode="register">
      <RegisterForm />
    </AuthLayout>
  )
}
