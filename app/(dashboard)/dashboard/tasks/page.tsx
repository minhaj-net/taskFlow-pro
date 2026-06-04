'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckSquare, Plus, Search, Filter, ArrowUpDown, Edit3, Trash2,
  Calendar, CheckCircle2, Clock, AlertCircle, X, User, RefreshCw,
  FolderKanban, ChevronLeft, ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import { useUsers } from '@/hooks/use-users'
import { logActivity } from '@/services/activity-service'
import type { User as UserType, Task, TaskStatus, TaskPriority } from '@/types'

export default function TasksPage() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)

  // ── Filters & Search ─────────────────────────────────────────
  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [memberFilter, setMemberFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'priority'>('latest')

  // ── Pagination ───────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // ── Modals State ─────────────────────────────────────────────
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // ── Form State ───────────────────────────────────────────────
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formProject, setFormProject] = useState('')
  const [formAssignee, setFormAssignee] = useState('')
  const [formDueDate, setFormDueDate] = useState('')
  const [formPriority, setFormPriority] = useState<TaskPriority>('medium')
  const [formStatus, setFormStatus] = useState<TaskStatus>('todo')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  // ── Queries & Mutations ──────────────────────────────────────
  const { data: tasks = [], isLoading: loadingTasks, refetch } = useTasks()
  const { data: projects = [], isLoading: loadingProjects } = useProjects()
  const { data: users = [], isLoading: loadingUsers } = useUsers()

  const createMutation = useCreateTask()
  const updateMutation = useUpdateTask()
  const deleteMutation = useDeleteTask()

  const isMember = currentUser?.role === 'member'
  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  // Initialize form
  useEffect(() => {
    if (editingTask) {
      setFormTitle(editingTask.title)
      setFormDesc(editingTask.description)
      setFormProject(editingTask.projectId)
      setFormAssignee(editingTask.assigneeId)
      setFormDueDate(editingTask.dueDate.split('T')[0])
      setFormPriority(editingTask.priority)
      setFormStatus(editingTask.status)
      setValidationError('')
    } else {
      setFormTitle('')
      setFormDesc('')
      setFormProject('')
      setFormAssignee('')
      setFormDueDate('')
      setFormPriority('medium')
      setFormStatus('todo')
      setValidationError('')
    }
  }, [editingTask, isCreateOpen])

  if (!currentUser) return null

  // ── Filter and Sort ──────────────────────────────────────────
  const roleFilteredTasks = isMember
    ? tasks.filter((t) => t.assigneeId === currentUser.id)
    : tasks

  const filteredTasks = roleFilteredTasks
    .filter((t) => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase())
      const matchProject = projectFilter === 'all' || t.projectId === projectFilter
      const matchStatus = statusFilter === 'all' || t.status === statusFilter
      const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
      const matchMember = memberFilter === 'all' || t.assigneeId === memberFilter
      return matchSearch && matchProject && matchStatus && matchPriority && matchMember
    })
    .sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      if (sortBy === 'priority') {
        const val = { high: 3, medium: 2, low: 1 }
        return val[b.priority] - val[a.priority]
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // Latest
    })

  // ── Pagination calculations ──────────────────────────────────
  const totalItems = filteredTasks.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage)

  // ── Handlers ─────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    if (!formTitle.trim() || !formDesc.trim() || !formProject || !formAssignee || !formDueDate) {
      setValidationError('All fields are required.')
      return
    }

    // Validation 1: Prevent duplicate task titles inside same project
    const isDuplicate = tasks.some((t) => 
      t.projectId === formProject && 
      t.title.trim().toLowerCase() === formTitle.trim().toLowerCase() && 
      (!editingTask || t.id !== editingTask.id)
    )
    if (isDuplicate) {
      setValidationError('This task already exists in the project.')
      return
    }

    // Validation 2: Prevent selecting past deadlines
    const dueDateObj = new Date(formDueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (dueDateObj < today) {
      setValidationError('Please select a valid deadline.')
      return
    }

    // Validation 3: Prevent reassigning completed tasks
    if (editingTask && editingTask.status === 'completed' && editingTask.assigneeId !== formAssignee) {
      setValidationError('Completed tasks cannot be reassigned.')
      return
    }

    try {
      if (editingTask) {
        await updateMutation.mutateAsync({
          id: editingTask.id,
          data: {
            title: formTitle,
            description: formDesc,
            assigneeId: formAssignee,
            dueDate: formDueDate,
            priority: formPriority,
            status: formStatus,
          },
        })
        await logActivity(
          currentUser.id,
          currentUser.name,
          'updated',
          'task',
          formTitle,
          editingTask.id
        )
        setEditingTask(null)
      } else {
        const newTask = await createMutation.mutateAsync({
          title: formTitle,
          description: formDesc,
          projectId: formProject,
          assigneeId: formAssignee,
          dueDate: formDueDate,
          priority: formPriority,
          status: formStatus,
        })
        await logActivity(
          currentUser.id,
          currentUser.name,
          'created',
          'task',
          formTitle,
          newTask.id
        )
        setIsCreateOpen(false)
      }
      refetch()
    } catch (err) {
      setValidationError('Failed to save task. Try again.')
    }
  }

  const handleQuickStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateMutation.mutateAsync({
        id: task.id,
        data: { status: newStatus },
      })
      await logActivity(
        currentUser.id,
        currentUser.name,
        'completed',
        'task',
        task.title,
        task.id
      )
      refetch()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleDelete = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await deleteMutation.mutateAsync(task.id)
      await logActivity(
        currentUser.id,
        currentUser.name,
        'deleted',
        'task',
        task.title,
        task.id
      )
      refetch()
    } catch (err) {
      alert('Failed to delete task')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isMember ? 'View and update your assigned tasks.' : 'Create, assign, and monitor tasks across projects.'}
          </p>
        </div>
        
        {canManage && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold text-primary-foreground bg-gradient-to-r from-primary to-tf-indigo shadow-md shadow-primary/20 hover:shadow-lg transition-all"
          >
            <Plus size={16} />
            Create Task
          </button>
        )}
      </div>

      {/* Filter and search bar */}
      <div className="bg-card border border-border p-4 rounded-2xl shadow-sm space-y-3">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search tasks by title or keywords…"
            className={cn(
              'w-full rounded-xl border border-border bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/60',
              'outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all',
            )}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Project filter */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground">
            <span>Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-foreground outline-none font-semibold cursor-pointer"
            >
              <option value="all">All</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground">
            <span>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-foreground outline-none font-semibold cursor-pointer"
            >
              <option value="all">All</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground">
            <span>Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="bg-transparent border-none text-foreground outline-none font-semibold cursor-pointer"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Member filter (non-member only) */}
          {!isMember && (
            <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground">
              <span>Assignee:</span>
              <select
                value={memberFilter}
                onChange={(e) => { setMemberFilter(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none text-foreground outline-none font-semibold cursor-pointer"
              >
                <option value="all">All</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          )}

          {/* Sort */}
          <div className="flex items-center gap-1 bg-background border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground ml-auto">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-none text-foreground outline-none font-semibold cursor-pointer"
            >
              <option value="latest">Latest</option>
              <option value="deadline">Nearest Deadline</option>
              <option value="priority">Highest Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task table / cards */}
      {loadingTasks ? (
        <div className="flex h-[30vh] items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paginatedTasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-sm font-semibold text-foreground">No tasks found</h3>
          <p className="mt-1 text-xs text-muted-foreground">Adjust filters or create a new task.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/20 text-xs font-semibold text-muted-foreground">
                    <th className="p-4 w-12 text-center">Done</th>
                    <th className="p-4">Title</th>
                    <th className="p-4">Project</th>
                    <th className="p-4">Assignee</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {paginatedTasks.map((t) => {
                    const project = projects.find((p) => p.id === t.projectId)
                    const assignee = users.find((u) => u.id === t.assigneeId)
                    const initials = assignee?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'

                    return (
                      <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={t.status === 'completed'}
                            onChange={() => handleQuickStatusChange(t, t.status === 'completed' ? 'todo' : 'completed')}
                            className="rounded border-border accent-primary h-4.5 w-4.5 cursor-pointer"
                          />
                        </td>
                        <td className="p-4">
                          <a href={`/dashboard/tasks/${t.id}`} className={cn(
                            'font-bold hover:text-primary transition-colors block text-foreground truncate max-w-xs',
                            t.status === 'completed' && 'line-through text-muted-foreground'
                          )}>
                            {t.title}
                          </a>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{project?.name ?? 'Unknown'}</td>
                        <td className="p-4">
                          {assignee ? (
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center text-[9px] font-bold">
                                {initials}
                              </div>
                              <span className="text-xs font-semibold text-foreground/80">{assignee.name}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={cn(
                            'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                            t.priority === 'high' && 'bg-danger/10 text-danger',
                            t.priority === 'medium' && 'bg-warning/10 text-warning',
                            t.priority === 'low' && 'bg-info/10 text-info'
                          )}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                          <Calendar size={12} />
                          {new Date(t.dueDate).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => setEditingTask(t)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                              title="Edit Task"
                            >
                              <Edit3 size={13} />
                            </button>
                            {canManage && (
                              <button
                                onClick={() => handleDelete(t)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
                                title="Delete Task"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs">
              <span className="text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} tasks
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="font-semibold text-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CREATE & EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {(isCreateOpen || editingTask) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsCreateOpen(false); setEditingTask(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl z-10"
            >
              <button
                onClick={() => { setIsCreateOpen(false); setEditingTask(null); }}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>

              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {validationError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                    <AlertCircle size={14} className="shrink-0" />
                    {validationError}
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Task Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <textarea
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Project Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Associated Project</label>
                  <select
                    value={formProject}
                    onChange={(e) => setFormProject(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Assigned Member</label>
                  <select
                    value={formAssignee}
                    onChange={(e) => setFormAssignee(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  >
                    <option value="">Select a team member</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Due Date */}
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-foreground">Due Date</label>
                    <input
                      type="date"
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Priority */}
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-foreground">Priority</label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-foreground">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    >
                      <option value="todo">Todo</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setIsCreateOpen(false); setEditingTask(null); }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
                  >
                    Save Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
