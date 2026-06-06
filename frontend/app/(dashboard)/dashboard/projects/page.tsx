'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban, Plus, Search, Filter, ArrowUpDown, Edit3, Trash2,
  Calendar, CheckCircle2, Clock, AlertCircle, X, Users, RefreshCw, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject
} from '@/hooks/use-projects'
import { useUsers } from '@/hooks/use-users'
import { useTasks } from '@/hooks/use-tasks'
import { logActivity } from '@/services/activity-service'
import type { User, Project, ProjectStatus } from '@/types'

export default function ProjectsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // ── Filters & Search ─────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'name'>('latest')

  // ── Modals State ─────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)

  // ── Form State ───────────────────────────────────────────────
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formDeadline, setFormDeadline] = useState('')
  const [formStatus, setFormStatus] = useState<ProjectStatus>('active')
  const [formMembers, setFormMembers] = useState<string[]>([])
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  // ── Queries & Mutations ──────────────────────────────────────
  const { data: projects = [], isLoading: loadingProjects, refetch } = useProjects()
  const { data: users = [], isLoading: loadingUsers } = useUsers()
  const { data: tasks = [] } = useTasks()
  
  const createMutation = useCreateProject()
  const updateMutation = useUpdateProject()
  const deleteMutation = useDeleteProject()

  const isMember = currentUser?.role === 'member'
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  // Initialize form for editing
  useEffect(() => {
    if (editingProject) {
      setFormName(editingProject.name)
      setFormDesc(editingProject.description)
      setFormDeadline(editingProject.deadline.split('T')[0])
      setFormStatus(editingProject.status)
      setFormMembers(editingProject.memberIds)
      setValidationError('')
    } else {
      setFormName('')
      setFormDesc('')
      setFormDeadline('')
      setFormStatus('active')
      setFormMembers(currentUser ? [currentUser.id] : [])
      setValidationError('')
    }
  }, [editingProject, isCreateOpen, currentUser])

  if (!currentUser) return null

  // ── Filter and Sort projects ─────────────────────────────────
  const roleFilteredProjects = isMember
    ? projects.filter((p) => p.memberIds.includes(currentUser.id))
    : projects

  const filteredProjects = roleFilteredProjects
    .filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.description.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || p.status === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // default latest
    })

  // ── Handlers ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!formName.trim() || !formDesc.trim() || !formDeadline) {
      setValidationError('All fields are required.')
      return
    }

    // Validation: deadline must not be in the past
    const deadlineDate = new Date(formDeadline)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (deadlineDate < today) {
      setValidationError('Please select a valid deadline.')
      return
    }

    try {
      if (editingProject) {
        await updateMutation.mutateAsync({
          id: editingProject.id,
          data: {
            name: formName,
            description: formDesc,
            deadline: formDeadline,
            status: formStatus,
            memberIds: formMembers,
          },
        })
        await logActivity(
          currentUser.id,
          currentUser.name,
          'updated',
          'project',
          formName,
          editingProject.id
        )
        setEditingProject(null)
      } else {
        const newProj = await createMutation.mutateAsync({
          name: formName,
          description: formDesc,
          deadline: formDeadline,
          status: formStatus,
          memberIds: formMembers,
          ownerId: currentUser.id,
        })
        await logActivity(
          currentUser.id,
          currentUser.name,
          'created',
          'project',
          formName,
          newProj.id
        )
        setIsCreateOpen(false)
      }
      refetch()
    } catch (err) {
      setValidationError('An error occurred. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    const proj = projects.find(p => p.id === id)
    try {
      await deleteMutation.mutateAsync(id)
      if (proj) {
        await logActivity(
          currentUser.id,
          currentUser.name,
          'deleted',
          'project',
          proj.name,
          id
        )
      }
      setDeletingProjectId(null)
      refetch()
    } catch (err) {
      alert('Failed to delete project')
    }
  }

  const toggleMemberSelection = (userId: string) => {
    setFormMembers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <FolderKanban className="h-8 w-8 text-primary" />
            Projects
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isMember ? 'Projects you are working on.' : 'Manage and track all company projects.'}
          </p>
        </div>
        
        {canManage && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground',
              'bg-gradient-to-r from-primary to-tf-indigo shadow-md shadow-primary/20 hover:shadow-lg transition-all',
            )}
          >
            <Plus size={16} />
            Create Project
          </button>
        )}
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name or keywords…"
            className={cn(
              'w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60',
              'outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
            )}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
            <Filter size={14} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none text-foreground outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground">
            <ArrowUpDown size={14} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-foreground outline-none text-xs font-semibold cursor-pointer"
            >
              <option value="latest">Latest Created</option>
              <option value="deadline">Nearest Deadline</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Projects */}
      {loadingProjects ? (
        <div className="flex h-[30vh] items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">No projects found</h3>
          <p className="mt-1 text-xs text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((p) => {
            const projectTasks = tasks.filter((t) => t.projectId === p.id)
            const completed = projectTasks.filter((t) => t.status === 'completed').length
            const total = projectTasks.length
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -3 }}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                      p.status === 'active' && 'bg-primary/10 text-primary',
                      p.status === 'completed' && 'bg-emerald/10 text-emerald',
                      p.status === 'on-hold' && 'bg-amber/10 text-amber'
                    )}>
                      {p.status}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Due {new Date(p.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <a href={`/dashboard/projects/${p.id}`} className="block group">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                      {p.name}
                    </h3>
                  </a>
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {/* Task Progress */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Tasks Progress</span>
                      <span>{completed}/{total} ({percent}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-tf-indigo h-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer members + CRUD icons */}
                  <div className="flex items-center justify-between border-t border-border/60 pt-3">
                    {/* Avatars */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {p.memberIds.slice(0, 4).map((uid) => {
                        const m = users.find(u => u.id === uid)
                        const init = m?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
                        return (
                          <div
                            key={uid}
                            title={m?.name}
                            className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/15 to-tf-indigo/15 border-2 border-card flex items-center justify-center text-[9px] font-bold text-primary shrink-0"
                          >
                            {init}
                          </div>
                        )
                      })}
                      {p.memberIds.length > 4 && (
                        <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[9px] font-bold text-muted-foreground shrink-0">
                          +{p.memberIds.length - 4}
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`/dashboard/projects/${p.id}`}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="View details"
                      >
                        <ExternalLink size={14} />
                      </a>
                      {canManage && (
                        <>
                          <button
                            onClick={() => setEditingProject(p)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Edit project"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingProjectId(p.id)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
                            title="Delete project"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* CREATE & EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {(isCreateOpen || editingProject) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCreateOpen(false); setEditingProject(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl z-10"
            >
              <button
                onClick={() => { setIsCreateOpen(false); setEditingProject(null); }}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>

              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {validationError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                    <AlertCircle size={14} className="shrink-0" />
                    {validationError}
                  </div>
                )}

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Project Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Enter project description"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Deadline */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Deadline</label>
                    <input
                      type="date"
                      value={formDeadline}
                      onChange={(e) => setFormDeadline(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as ProjectStatus)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                </div>

                {/* Members Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground block mb-1">Project Members</label>
                  <div className="max-h-28 overflow-y-auto border border-border rounded-xl p-2 bg-background space-y-1 text-xs">
                    {users.map((user) => (
                      <label key={user.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formMembers.includes(user.id)}
                          onChange={() => toggleMemberSelection(user.id)}
                          className="rounded border-border accent-primary h-3.5 w-3.5"
                        />
                        <span className="font-medium text-foreground">{user.name}</span>
                        <span className="text-[10px] text-muted-foreground">({user.department})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsCreateOpen(false); setEditingProject(null); }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Saving…' : 'Save Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingProjectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeletingProjectId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10"
            >
              <h2 className="text-lg font-bold text-foreground">Delete Project?</h2>
              <p className="text-xs text-muted-foreground mt-2">
                Are you sure you want to delete this project? This will permanently delete the project and cannot be undone.
              </p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setDeletingProjectId(null)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deletingProjectId)}
                  className="rounded-xl bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/95 shadow-md hover:shadow-lg transition-all"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
