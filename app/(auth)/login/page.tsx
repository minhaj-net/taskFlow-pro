import type { Metadata } from 'next'
import AuthLayout from '@/app/components/auth/AuthLayout'
import LoginForm from '@/app/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In — TaskFlow Pro',
  description: 'Sign in to your TaskFlow Pro account.',
}

export default function LoginPage() {
  return (
    <AuthLayout mode="login">
      <LoginForm />
    </AuthLayout>
  )
}
