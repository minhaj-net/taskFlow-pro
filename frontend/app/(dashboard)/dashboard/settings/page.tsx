'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Settings, Bell, Monitor, Shield, User, Building,
  Moon, Sun, CheckCircle2, AlertCircle, Key, Trash2,
  Globe, Sliders, Users, FolderKanban, Activity,
  Lock, Eye, EyeOff, Save, RefreshCw, X, Zap,
  BellOff, BellRing, Mail, Laptop
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession, saveSession, getToken } from '@/lib/auth'
import type { User as UserType, Role } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// ── Toggle component ──────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50',
        checked ? 'bg-primary' : 'bg-muted border border-border',
      )}
    >
      <span className={cn(
        'inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform',
        checked ? 'translate-x-6' : 'translate-x-1',
      )} />
    </button>
  )
}

// ── Section wrapper ───────────────────────────────────────────
function Section({ icon: Icon, title, description, children, accent = 'text-primary' }: {
  icon: React.ElementType; title: string; description?: string
  children: React.ReactNode; accent?: string
}) {
  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon size={15} className={accent} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground">{title}</h2>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

// ── Setting row ───────────────────────────────────────────────
function SettingRow({ label, description, children }: {
  label: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground">{label}</div>
        {description && <div className="text-xs text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  // ── Profile edit state ────────────────────────────────────
  const [editName,   setEditName]   = useState('')
  const [editDept,   setEditDept]   = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg,    setProfileMsg]    = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── Password change state ─────────────────────────────────
  const [currPass,    setCurrPass]    = useState('')
  const [newPass,     setNewPass]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurr,    setShowCurr]    = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [passSaving,  setPassSaving]  = useState(false)
  const [passMsg,     setPassMsg]     = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // ── Notification prefs ────────────────────────────────────
  const [notifTaskAssigned,  setNotifTaskAssigned]  = useState(true)
  const [notifTaskUpdated,   setNotifTaskUpdated]   = useState(true)
  const [notifTaskCompleted, setNotifTaskCompleted] = useState(true)
  const [notifProjectUpdate, setNotifProjectUpdate] = useState(true)
  const [notifDeadline,      setNotifDeadline]      = useState(true)
  const [notifMemberChange,  setNotifMemberChange]  = useState(true)

  // ── Display prefs ─────────────────────────────────────────
  const [compactMode,   setCompactMode]   = useState(false)
  const [showAvatars,   setShowAvatars]   = useState(true)
  const [animationsOn,  setAnimationsOn]  = useState(true)

  // ── Admin-only: system settings ───────────────────────────
  const [allowRegistration, setAllowRegistration] = useState(true)
  const [requireApproval,   setRequireApproval]   = useState(false)
  const [sessionTimeout,    setSessionTimeout]    = useState('7d')

  // ── Manager-only: team settings ───────────────────────────
  const [taskAutoAssign,  setTaskAutoAssign]  = useState(false)
  const [deadlineAlerts,  setDeadlineAlerts]  = useState(true)
  const [progressReports, setProgressReports] = useState(true)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setCurrentUser(session.user)
      setEditName(session.user.name)
      setEditDept(session.user.department || '')
    }
  }, [])

  if (!currentUser) return null

  const role    = currentUser.role
  const isDark  = resolvedTheme === 'dark'

  const roleAccent: Record<Role, { text: string; bg: string; gradient: string }> = {
    admin:   { text: 'text-red-500',    bg: 'bg-red-500/10',    gradient: 'from-red-500 to-rose-600'      },
    manager: { text: 'text-amber-500',  bg: 'bg-amber-500/10',  gradient: 'from-amber-500 to-orange-500'  },
    member:  { text: 'text-blue-500',   bg: 'bg-blue-500/10',   gradient: 'from-blue-500 to-indigo-600'   },
  }
  const accent = roleAccent[role]

  // ── Save profile ──────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editName.trim()) { setProfileMsg({ type: 'error', text: 'Name cannot be empty.' }); return }
    setProfileSaving(true); setProfileMsg(null)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName.trim(), department: editDept.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      // Update local session
      saveSession({ ...currentUser, name: editName.trim(), department: editDept.trim() }, token ?? undefined)
      setCurrentUser(prev => prev ? { ...prev, name: editName.trim(), department: editDept.trim() } : prev)
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile.' })
    } finally {
      setProfileSaving(false)
      setTimeout(() => setProfileMsg(null), 3000)
    }
  }

  // ── Save password ─────────────────────────────────────────
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPassMsg(null)
    if (!currPass || !newPass || !confirmPass) {
      setPassMsg({ type: 'error', text: 'All password fields are required.' }); return
    }
    if (newPass.length < 6) {
      setPassMsg({ type: 'error', text: 'New password must be at least 6 characters.' }); return
    }
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'error', text: 'New passwords do not match.' }); return
    }
    setPassSaving(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setPassMsg({ type: 'success', text: 'Password changed successfully!' })
      setCurrPass(''); setNewPass(''); setConfirmPass('')
    } catch (err: any) {
      setPassMsg({ type: 'error', text: err.message || 'Password change failed.' })
    } finally {
      setPassSaving(false)
      setTimeout(() => setPassMsg(null), 4000)
    }
  }

  const initials = currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="space-y-6 max-w-4xl mx-auto">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Settings className="h-8 w-8 text-primary" />
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === 'admin'   && 'Manage platform settings, security, and all user preferences.'}
            {role === 'manager' && 'Configure team notifications, project defaults, and your preferences.'}
            {role === 'member'  && 'Manage your personal preferences, notifications, and account settings.'}
          </p>
        </div>
        <span className={cn(
          'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shrink-0',
          role === 'admin'   && 'bg-red-500/10 text-red-500 border-red-500/20',
          role === 'manager' && 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          role === 'member'  && 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        )}>{role}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── LEFT: Profile ──────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-5">

          {/* Profile card */}
          <div className={cn('rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg', accent.gradient)}>
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-16 w-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-xl font-extrabold shadow-lg">
                {initials}
              </div>
              <div>
                <div className="font-bold text-lg">{currentUser.name}</div>
                <div className="text-white/80 text-xs">{currentUser.email}</div>
                <div className="text-white/70 text-[11px] mt-1">{currentUser.department || 'No department set'}</div>
              </div>
              <span className="px-3 py-0.5 rounded-full bg-white/20 text-xs font-bold uppercase">{role}</span>
            </div>
          </div>

          {/* Edit profile */}
          <Section icon={User} title="Edit Profile" description="Update your name and department." accent={accent.text}>
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <AnimatePresence>
                {profileMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium',
                      profileMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-500 border border-red-500/20')}>
                    {profileMsg.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {profileMsg.text}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Full Name</label>
                <input value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Department</label>
                <input value={editDept} onChange={e => setEditDept(e.target.value)}
                  placeholder="e.g. Engineering"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
              </div>
              <button type="submit" disabled={profileSaving}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                {profileSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                {profileSaving ? 'Saving…' : 'Save Profile'}
              </button>
            </form>
          </Section>

          {/* Change password */}
          <Section icon={Key} title="Change Password" description="Keep your account secure." accent={accent.text}>
            <form onSubmit={handleChangePassword} className="space-y-3">
              <AnimatePresence>
                {passMsg && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className={cn('flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium',
                      passMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                 : 'bg-red-500/10 text-red-500 border border-red-500/20')}>
                    {passMsg.type === 'success' ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    {passMsg.text}
                  </motion.div>
                )}
              </AnimatePresence>

              {[
                { label: 'Current Password', val: currPass, set: setCurrPass, show: showCurr, toggle: () => setShowCurr(s => !s) },
                { label: 'New Password',     val: newPass,  set: setNewPass,  show: showNew,  toggle: () => setShowNew(s => !s)  },
                { label: 'Confirm New',      val: confirmPass, set: setConfirmPass, show: showNew, toggle: () => setShowNew(s => !s) },
              ].map(({ label, val, set, show, toggle }) => (
                <div key={label} className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">{label}</label>
                  <div className="relative">
                    <input type={show ? 'text' : 'password'} value={val} onChange={e => set(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                    <button type="button" onClick={toggle}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}

              <button type="submit" disabled={passSaving}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-background py-2 text-sm font-semibold text-foreground hover:bg-muted transition-all disabled:opacity-60">
                {passSaving ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                {passSaving ? 'Verifying…' : 'Change Password'}
              </button>
            </form>
          </Section>
        </div>

        {/* ── RIGHT: Preferences ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Appearance */}
          <Section icon={Monitor} title="Appearance" description="Customize the look and feel of your dashboard." accent={accent.text}>
            <SettingRow label="Theme" description="Switch between light and dark mode">
              <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1">
                <button onClick={() => setTheme('light')}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    resolvedTheme === 'light' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                  <Sun size={13} /> Light
                </button>
                <button onClick={() => setTheme('dark')}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    resolvedTheme === 'dark' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                  <Moon size={13} /> Dark
                </button>
                <button onClick={() => setTheme('system')}
                  className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    resolvedTheme === 'system' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground')}>
                  <Laptop size={13} /> System
                </button>
              </div>
            </SettingRow>
            <SettingRow label="Compact Mode" description="Reduce spacing for a denser layout">
              <Toggle checked={compactMode} onChange={() => setCompactMode(s => !s)} />
            </SettingRow>
            <SettingRow label="Show Avatars" description="Display member initials in project cards">
              <Toggle checked={showAvatars} onChange={() => setShowAvatars(s => !s)} />
            </SettingRow>
            <SettingRow label="Animations" description="Enable motion and transition effects">
              <Toggle checked={animationsOn} onChange={() => setAnimationsOn(s => !s)} />
            </SettingRow>
          </Section>

          {/* Notifications */}
          <Section icon={Bell} title="Notification Preferences" description="Choose which events send you notifications." accent={accent.text}>
            <SettingRow label="Task Assigned to Me" description="When a task is assigned to you">
              <Toggle checked={notifTaskAssigned} onChange={() => setNotifTaskAssigned(s => !s)} />
            </SettingRow>
            <SettingRow label="Task Updated" description="When your assigned task is modified">
              <Toggle checked={notifTaskUpdated} onChange={() => setNotifTaskUpdated(s => !s)} />
            </SettingRow>
            {(role === 'admin' || role === 'manager') && (
              <SettingRow label="Task Completed" description="When a team member completes a task">
                <Toggle checked={notifTaskCompleted} onChange={() => setNotifTaskCompleted(s => !s)} />
              </SettingRow>
            )}
            <SettingRow label="Project Updates" description="When a project you're in is changed">
              <Toggle checked={notifProjectUpdate} onChange={() => setNotifProjectUpdate(s => !s)} />
            </SettingRow>
            <SettingRow label="Deadline Reminders" description="Alerts before task due dates">
              <Toggle checked={notifDeadline} onChange={() => setNotifDeadline(s => !s)} />
            </SettingRow>
            {(role === 'admin' || role === 'manager') && (
              <SettingRow label="Member Changes" description="When members join or leave projects">
                <Toggle checked={notifMemberChange} onChange={() => setNotifMemberChange(s => !s)} />
              </SettingRow>
            )}
          </Section>

          {/* Manager-specific: Team settings */}
          {role === 'manager' && (
            <Section icon={Users} title="Team Settings" description="Configure defaults for your team and projects." accent="text-amber-500">
              <SettingRow label="Auto-assign Tasks" description="Distribute new tasks evenly across team members">
                <Toggle checked={taskAutoAssign} onChange={() => setTaskAutoAssign(s => !s)} />
              </SettingRow>
              <SettingRow label="Deadline Alerts to Team" description="Notify members 24h before task deadlines">
                <Toggle checked={deadlineAlerts} onChange={() => setDeadlineAlerts(s => !s)} />
              </SettingRow>
              <SettingRow label="Weekly Progress Reports" description="Auto-generate team progress summaries">
                <Toggle checked={progressReports} onChange={() => setProgressReports(s => !s)} />
              </SettingRow>
              <div className="pt-2">
                <label className="text-xs font-semibold text-foreground block mb-1.5">Default Task Priority</label>
                <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </Section>
          )}

          {/* Admin-specific: System settings */}
          {role === 'admin' && (
            <Section icon={Shield} title="System Settings" description="Platform-wide controls — changes affect all users." accent="text-red-500">
              <SettingRow label="Open Registration" description="Allow new users to create accounts freely">
                <Toggle checked={allowRegistration} onChange={() => setAllowRegistration(s => !s)} />
              </SettingRow>
              <SettingRow label="Require Admin Approval" description="New accounts need approval before dashboard access">
                <Toggle checked={requireApproval} onChange={() => setRequireApproval(s => !s)} />
              </SettingRow>
              <div className="pt-2">
                <label className="text-xs font-semibold text-foreground block mb-1.5">Session Token Duration</label>
                <select value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days (default)</option>
                  <option value="30d">30 Days</option>
                  <option value="90d">90 Days</option>
                </select>
              </div>
              <div className="pt-1">
                <label className="text-xs font-semibold text-foreground block mb-1.5">Default New User Role</label>
                <select className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                  <option value="member">Member</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
            </Section>
          )}

          {/* Admin-specific: Danger zone */}
          {role === 'admin' && (
            <div className="bg-card border border-red-500/20 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-red-500/20 flex items-center gap-3 bg-red-500/5">
                <AlertCircle size={15} className="text-red-500" />
                <div>
                  <h2 className="text-sm font-bold text-red-500">Danger Zone</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">Irreversible actions — proceed with extreme caution.</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Clear All Activity Logs</div>
                    <div className="text-xs text-muted-foreground">Permanently delete all activity history</div>
                  </div>
                  <button
                    onClick={async () => {
                      if (!confirm('Are you sure? This will permanently delete all activity logs.')) return
                      try {
                        const token = getToken()
                        const res = await fetch(`${API_BASE}/activities`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        })
                        alert(res.ok ? 'Activity logs cleared.' : 'Failed to clear logs.')
                      } catch { alert('Failed to clear logs.') }
                    }}
                    className="rounded-xl border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors">
                    Clear Logs
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div>
                    <div className="text-sm font-semibold text-foreground">Export All Data</div>
                    <div className="text-xs text-muted-foreground">Download a full backup of platform data</div>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        const token = getToken()
                        const [usersRes, projectsRes, tasksRes] = await Promise.all([
                          fetch(`${API_BASE}/users`,    { headers: { Authorization: `Bearer ${token}` } }),
                          fetch(`${API_BASE}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
                          fetch(`${API_BASE}/tasks`,    { headers: { Authorization: `Bearer ${token}` } }),
                        ])
                        const [users, projects, tasks] = await Promise.all([usersRes.json(), projectsRes.json(), tasksRes.json()])
                        const blob = new Blob([JSON.stringify({ users: users.data, projects: projects.data, tasks: tasks.data }, null, 2)], { type: 'application/json' })
                        const url  = URL.createObjectURL(blob)
                        const a    = document.createElement('a')
                        a.href     = url
                        a.download = `taskflow-export-${new Date().toISOString().split('T')[0]}.json`
                        a.click()
                        URL.revokeObjectURL(url)
                      } catch { alert('Export failed. Please try again.') }
                    }}
                    className="rounded-xl border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-colors">
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save preferences button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                const el = document.createElement('div')
                el.className = 'fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg'
                el.innerHTML = '✓ Preferences saved'
                document.body.appendChild(el)
                setTimeout(() => el.remove(), 2500)
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
            >
              <Save size={15} />
              Save All Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
