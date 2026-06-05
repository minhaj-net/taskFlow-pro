'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from '@/lib/auth'
import DashboardHome from '@/app/components/dashboard/DashboardHome'
import type { User } from '@/types'

export default function ManagerDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== 'manager') {
      router.replace('/login')
      return
    }
    setUser(session.user)
  }, [router])

  if (!user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    )
  }

  return <DashboardHome role="manager" currentUser={user} />
}
