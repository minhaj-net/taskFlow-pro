'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'
import { getSession, clearSession, saveSession } from '@/lib/auth'
import { loginWithCredentials } from '@/services/user-service'
import { ROLE_DASHBOARD } from '@/types'

export function useAuth() {
  const [user, setUser]       = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router                = useRouter()

  useEffect(() => {
    const session = getSession()
    setUser(session?.user ?? null)
    setLoading(false)
  }, [])

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await loginWithCredentials(email, password)
      setUser(session.user)
      // Set cookie so middleware can gate dashboard routes
      document.cookie = `tfp_auth=1; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
      document.cookie = `tfp_role=${session.user.role}; path=/; max-age=${60 * 60 * 24 * 7}`
      return session.user
    },
    [],
  )

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    // Clear cookies
    document.cookie = 'tfp_auth=; path=/; max-age=0'
    document.cookie = 'tfp_role=; path=/; max-age=0'
    router.push('/login')
  }, [router])

  return { user, loading, login, logout }
}
