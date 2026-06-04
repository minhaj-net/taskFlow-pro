'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ShieldAlert, ShieldCheck, UserCheck, UserX, Search,
  Filter, Mail, Calendar, Shield, RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useUsers } from '@/hooks/use-users'
import type { User, Role } from '@/types'

export default function UsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== 'admin') {
      router.replace('/dashboard/dashboard')
      return
    }
    setCurrentUser(session.user)
  }, [router])

  const { data: users = [], isLoading } = useUsers()

  if (!currentUser) return null

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const filteredUsers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Users Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Lock, verify, and update system users, settings, and authorization settings.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email…"
            className={cn(
              'w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60',
              'outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
            )}
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
          <Filter size={14} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-transparent border-none text-foreground outline-none text-xs font-semibold cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Project Manager</option>
            <option value="member">Team Member</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground">
                <th className="p-4">User</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.map((user) => {
                const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-xs text-primary-foreground shadow-sm shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="font-bold text-foreground flex items-center gap-1.5">
                            {user.name}
                            {user.id === currentUser.id && (
                              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">You</span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground block">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-medium text-muted-foreground">{user.department}</td>
                    <td className="p-4">
                      <span className={cn(
                        'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                        user.role === 'admin' && 'bg-danger/10 text-danger',
                        user.role === 'manager' && 'bg-warning/10 text-warning',
                        user.role === 'member' && 'bg-info/10 text-info'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full',
                        user.isActive ? 'bg-emerald/10 text-emerald' : 'bg-muted text-muted-foreground'
                      )}>
                        {user.isActive ? <UserCheck size={10} /> : <UserX size={10} />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
