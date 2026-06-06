'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck, UserX, Search, Filter,
  Trash2, RefreshCw, X, AlertCircle, ChevronDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/use-users'
import type { User, Role } from '@/types'

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'admin',   label: 'Admin'   },
  { value: 'manager', label: 'Manager' },
  { value: 'member',  label: 'Member'  },
]

export default function UsersPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [search,      setSearch]      = useState('')
  const [roleFilter,  setRoleFilter]  = useState('all')
  const [deletingId,  setDeletingId]  = useState<string | null>(null)
  const [errorMsg,    setErrorMsg]    = useState('')

  useEffect(() => {
    const session = getSession()
    if (!session || session.user.role !== 'admin') {
      router.replace('/dashboard/dashboard')
      return
    }
    setCurrentUser(session.user)
  }, [router])

  const { data: users = [], isLoading, refetch } = useUsers()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

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

  // ── Role change ──────────────────────────────────────────────
  const handleRoleChange = async (user: User, newRole: Role) => {
    if (user.role === newRole) return
    setErrorMsg('')
    try {
      await updateMutation.mutateAsync({ id: user.id, data: { role: newRole } })
      refetch()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update role')
    }
  }

  // ── Toggle active/inactive ───────────────────────────────────
  const handleToggleActive = async (user: User) => {
    setErrorMsg('')
    try {
      await updateMutation.mutateAsync({ id: user.id, data: { isActive: !user.isActive } })
      refetch()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  // ── Delete ───────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setErrorMsg('')
    try {
      await deleteMutation.mutateAsync(id)
      setDeletingId(null)
      refetch()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to delete user')
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          Users Directory
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage roles, status, and access for all system users.
        </p>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            <span className="flex items-center gap-2"><AlertCircle size={15} />{errorMsg}</span>
            <button onClick={() => setErrorMsg('')}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

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
              'w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground',
              'placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
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
            <option value="manager">Manager</option>
            <option value="member">Member</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Department</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  const isSelf = user.id === currentUser.id

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      {/* User */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-xs text-primary-foreground shadow-sm shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-bold text-foreground flex items-center gap-1.5">
                              {user.name}
                              {isSelf && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">You</span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="p-4 text-xs font-medium text-muted-foreground">
                        {user.department || '—'}
                      </td>

                      {/* Role — inline dropdown */}
                      <td className="p-4">
                        <div className={cn(
                          'relative inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider cursor-pointer',
                          user.role === 'admin'   && 'bg-danger/10 text-danger',
                          user.role === 'manager' && 'bg-warning/10 text-warning',
                          user.role === 'member'  && 'bg-info/10 text-info',
                          isSelf && 'opacity-60 pointer-events-none',
                        )}>
                          <select
                            value={user.role}
                            disabled={isSelf || updateMutation.isPending}
                            onChange={(e) => handleRoleChange(user, e.target.value as Role)}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full"
                            aria-label={`Change role for ${user.name}`}
                          >
                            {ROLE_OPTIONS.map(o => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          {user.role}
                          {!isSelf && <ChevronDown size={9} />}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="p-4 text-xs text-muted-foreground">
                        {new Date(user.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Status toggle */}
                      <td className="p-4">
                        <button
                          onClick={() => !isSelf && handleToggleActive(user)}
                          disabled={isSelf || updateMutation.isPending}
                          className={cn(
                            'inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-colors',
                            user.isActive
                              ? 'bg-emerald/10 text-emerald hover:bg-emerald/20'
                              : 'bg-muted text-muted-foreground hover:bg-muted/80',
                            isSelf && 'pointer-events-none opacity-60',
                          )}
                          title={isSelf ? 'Cannot change own status' : user.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          <UserX size={10} className={user.isActive ? 'hidden' : ''} />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {!isSelf && (
                            <button
                              onClick={() => setDeletingId(user.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
                              title="Delete user"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10"
            >
              <h2 className="text-lg font-bold text-foreground">Delete User?</h2>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently remove the user and cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setDeletingId(null)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  disabled={deleteMutation.isPending}
                  className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90 shadow-md transition-all"
                >
                  {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
