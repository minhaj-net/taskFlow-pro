'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Search, Filter, Mail, Calendar,
  RefreshCw, ChevronDown, ChevronUp,
  Plus, Edit3, Trash2, X, AlertCircle, UserPlus,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/use-users'
import { useTasks } from '@/hooks/use-tasks'
import type { User, Task, Role } from '@/types'

const ROLES: Role[] = ['admin', 'manager', 'member']

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

function getToken() {
  if (typeof window === 'undefined') return null
  try { return JSON.parse(localStorage.getItem('tfp_session') || '{}')?.token ?? null }
  catch { return null }
}

// ── Invite form default ───────────────────────────────────────
const BLANK_INVITE = { name: '', email: '', password: '', role: 'member' as Role, department: '' }

export default function TeamPage() {
  const [currentUser,     setCurrentUser]     = useState<User | null>(null)
  const [search,          setSearch]          = useState('')
  const [deptFilter,      setDeptFilter]      = useState('all')
  const [expandedMember,  setExpandedMember]  = useState<string | null>(null)

  // ── Modal state ───────────────────────────────────────────────
  const [inviteOpen,   setInviteOpen]   = useState(false)
  const [editingUser,  setEditingUser]  = useState<User | null>(null)
  const [deletingId,   setDeletingId]   = useState<string | null>(null)

  // ── Invite form ───────────────────────────────────────────────
  const [invite,       setInvite]       = useState(BLANK_INVITE)
  const [inviteError,  setInviteError]  = useState('')
  const [inviteOk,     setInviteOk]     = useState(false)
  const [inviteLoading,setInviteLoading]= useState(false)

  // ── Edit form ─────────────────────────────────────────────────
  const [editName,   setEditName]   = useState('')
  const [editRole,   setEditRole]   = useState<Role>('member')
  const [editDept,   setEditDept]   = useState('')
  const [editActive, setEditActive] = useState(true)
  const [editError,  setEditError]  = useState('')

  const [globalError, setGlobalError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: users = [], isLoading: loadingUsers, refetch } = useUsers()
  const { data: tasks = [], isLoading: loadingTasks }          = useTasks()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const isAdmin   = currentUser?.role === 'admin'
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  // ── Open edit modal ───────────────────────────────────────────
  const openEdit = (u: User) => {
    setEditingUser(u)
    setEditName(u.name)
    setEditRole(u.role)
    setEditDept(u.department)
    setEditActive(u.isActive)
    setEditError('')
  }

  // ── Invite submit ─────────────────────────────────────────────
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError('')
    if (!invite.name || !invite.email || !invite.password) {
      setInviteError('Name, email, and password are required.')
      return
    }
    setInviteLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: invite.name, email: invite.email, password: invite.password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || 'Failed to invite member.')

      // If role or department is non-default, find the new user and update
      if (invite.role !== 'member' || invite.department) {
        await refetch()
        const fresh = (await refetch()).data ?? []
        const newUser = fresh.find((u: User) => u.email === invite.email)
        if (newUser) {
          await updateMutation.mutateAsync({
            id: newUser.id,
            data: { role: invite.role, department: invite.department },
          })
        }
      }

      setInviteOk(true)
      setInvite(BLANK_INVITE)
      refetch()
      setTimeout(() => { setInviteOk(false); setInviteOpen(false) }, 1500)
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to invite member.')
    } finally {
      setInviteLoading(false)
    }
  }

  // ── Edit submit ───────────────────────────────────────────────
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    setEditError('')
    try {
      await updateMutation.mutateAsync({
        id: editingUser.id,
        data: { name: editName, role: editRole, department: editDept, isActive: editActive },
      })
      refetch()
      setEditingUser(null)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update member.')
    }
  }

  // ── Delete ────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setGlobalError('')
    try {
      await deleteMutation.mutateAsync(id)
      setDeletingId(null)
      refetch()
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Failed to remove member.')
      setDeletingId(null)
    }
  }

  if (loadingUsers || loadingTasks) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const departments    = Array.from(new Set(users.map(u => u.department).filter(Boolean)))
  const filteredMembers = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'all' || u.department === deptFilter
    return matchSearch && matchDept
  })

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            Team Members
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View workloads, roles, and collaboration stats for your team.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => { setInviteOpen(true); setInviteError(''); setInviteOk(false) }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus size={15} />
            Invite Member
          </button>
        )}
      </div>

      {/* Global error */}
      <AnimatePresence>
        {globalError && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <span className="flex items-center gap-2"><AlertCircle size={14} />{globalError}</span>
            <button onClick={() => setGlobalError('')}><X size={14} /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
          <Filter size={14} />
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-transparent border-none text-foreground outline-none text-xs font-semibold cursor-pointer">
            <option value="all">All Departments</option>
            {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
      </div>

      {/* Team Cards */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        {filteredMembers.length === 0 ? (
          <div className="col-span-2 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">No team members found.</p>
          </div>
        ) : filteredMembers.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id)
          const completed   = memberTasks.filter((t) => t.status === 'completed').length
          const total       = memberTasks.length
          const pending     = total - completed
          const percent     = total > 0 ? Math.round((completed / total) * 100) : 0
          const initials    = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          const isExpanded  = expandedMember === member.id
          const isSelf      = member.id === currentUser?.id

          return (
            <motion.div key={member.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:shadow-md transition-all duration-200"
            >
              {/* Profile row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-sm text-primary-foreground shrink-0 shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground flex items-center gap-1.5">
                      {member.name}
                      {isSelf && <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">You</span>}
                    </h3>
                    <span className="text-xs text-muted-foreground">{member.department || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider',
                    member.role === 'admin'   && 'bg-danger/10 text-danger',
                    member.role === 'manager' && 'bg-warning/10 text-warning',
                    member.role === 'member'  && 'bg-info/10 text-info',
                  )}>{member.role}</span>

                  {canManage && !isSelf && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(member)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Edit">
                        <Edit3 size={13} />
                      </button>
                      {isAdmin && (
                        <button onClick={() => setDeletingId(member.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors" title="Remove">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2.5 bg-muted/40 border border-border/40 p-3 rounded-xl text-center text-xs">
                <div><div className="font-extrabold text-foreground">{total}</div><div className="text-[10px] text-muted-foreground mt-0.5 uppercase">Total</div></div>
                <div><div className="font-extrabold text-emerald-500">{completed}</div><div className="text-[10px] text-muted-foreground mt-0.5 uppercase">Done</div></div>
                <div><div className="font-extrabold text-amber-500">{pending}</div><div className="text-[10px] text-muted-foreground mt-0.5 uppercase">Pending</div></div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
                  <span>Productivity</span><span>{percent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-tf-indigo h-full transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border/60 pt-3 flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Mail size={12} />{member.email}</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {new Date(member.joinedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {total > 0 && (
                  <div>
                    <button onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                      className="w-full flex items-center justify-between text-xs text-primary hover:text-primary/80 font-semibold">
                      <span>{isExpanded ? 'Hide' : 'Show'} Tasks ({total})</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }} className="overflow-hidden mt-3 space-y-2">
                          {memberTasks.map((t) => (
                            <a key={t.id} href={`/dashboard/tasks/${t.id}`}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60 hover:bg-muted/40 transition-colors text-xs">
                              <span className={cn('font-semibold truncate max-w-[180px]', t.status === 'completed' && 'line-through text-muted-foreground')}>{t.title}</span>
                              <span className={cn('text-[9px] font-bold px-2 py-0.5 rounded-full uppercase',
                                t.status === 'completed'  && 'bg-emerald-500/10 text-emerald-500',
                                t.status === 'in-progress'&& 'bg-blue-500/10 text-blue-500',
                                t.status === 'todo'       && 'bg-slate-500/10 text-slate-500',
                              )}>{t.status}</span>
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── INVITE MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {inviteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setInviteOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl z-10">
              <button onClick={() => setInviteOpen(false)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
              <h2 className="text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                <UserPlus size={18} className="text-primary" /> Invite Team Member
              </h2>
              <p className="text-xs text-muted-foreground mb-5">A new account will be created for this member.</p>

              {inviteOk ? (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600">
                  <CheckCircle2 size={15} /> Member invited successfully!
                </div>
              ) : (
                <form onSubmit={handleInvite} className="space-y-4">
                  {inviteError && (
                    <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                      <AlertCircle size={13} />{inviteError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-foreground">Full Name</label>
                      <input type="text" value={invite.name} onChange={e => setInvite(p => ({ ...p, name: e.target.value }))}
                        placeholder="Jane Smith"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-foreground">Email</label>
                      <input type="email" value={invite.email} onChange={e => setInvite(p => ({ ...p, email: e.target.value }))}
                        placeholder="jane@company.com"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-foreground">Temporary Password</label>
                      <input type="text" value={invite.password} onChange={e => setInvite(p => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 6 characters"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Role</label>
                      <select value={invite.role} onChange={e => setInvite(p => ({ ...p, role: e.target.value as Role }))}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                        {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground">Department</label>
                      <input type="text" value={invite.department} onChange={e => setInvite(p => ({ ...p, department: e.target.value }))}
                        placeholder="e.g. Engineering"
                        className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-1">
                    <button type="button" onClick={() => setInviteOpen(false)}
                      className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                      Cancel
                    </button>
                    <button type="submit" disabled={inviteLoading}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                      <UserPlus size={14} />
                      {inviteLoading ? 'Inviting…' : 'Send Invite'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── EDIT MODAL ────────────────────────────────────────────── */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl z-10">
              <button onClick={() => setEditingUser(null)}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
              <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <Edit3 size={17} className="text-primary" /> Edit Member
              </h2>

              <form onSubmit={handleEditSave} className="space-y-4">
                {editError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                    <AlertCircle size={13} />{editError}
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Name</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Role</label>
                    <select value={editRole} onChange={e => setEditRole(e.target.value as Role)}
                      disabled={!isAdmin}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50">
                      {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                    {!isAdmin && <p className="text-[10px] text-muted-foreground">Only admins can change roles</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Department</label>
                    <input type="text" value={editDept} onChange={e => setEditDept(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={editActive} onChange={e => setEditActive(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary" />
                  <span className="text-sm text-foreground font-medium">Active member</span>
                </label>

                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={() => setEditingUser(null)}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={updateMutation.isPending}
                    className="rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                    {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10">
              <h2 className="text-lg font-bold text-foreground">Remove Member?</h2>
              <p className="text-xs text-muted-foreground mt-2">
                This will permanently delete the user account. This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setDeletingId(null)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deletingId)} disabled={deleteMutation.isPending}
                  className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90 shadow-md transition-all disabled:opacity-60">
                  {deleteMutation.isPending ? 'Removing…' : 'Remove'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
