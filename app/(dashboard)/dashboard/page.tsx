'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { ROLE_DASHBOARD } from '@/types'

/**
 * /dashboard — smart redirect to the role-specific home page.
 * analytics / activity pages redirect here when role check fails,
 * and we immediately forward to the correct role dashboard.
 */
export default function DashboardIndexPage() {
  const router = useRouter()

  useEffect(() => {
    const session = getSession()
    if (!session) {
      router.replace('/login')
      return
    }
    router.replace(ROLE_DASHBOARD[session.user.role])
  }, [router])

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  )
}
