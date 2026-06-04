'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban, ArrowLeft, Calendar, Shield, Users,
  CheckCircle2, Clock, AlertTriangle, Paperclip, FileText,
  Upload, Plus, Search, CheckSquare, Edit3, Trash2, X,
  ExternalLink, BarChart2, MessageSquare, AlertCircle, RefreshCw,
  User as UserIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useProject, useUpdateProject } from '@/hooks/use-projects'
import { useTasksByProject, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { logActivity } from '@/services/activity-service'
import type { User, Project, Task, TaskStatus, TaskPriority } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

interface MockFile {
  name: string
  size: string
  uploadedBy: string
  uploadedAt: string
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const router = useRouter()
  
  // Resolve params using React.use()
  const resolvedParams = use(params)
  const projectId = resolvedParams.id

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'tasks' | 'members' | 'files'>('tasks')
  
  // ── Mock Files System ────────────────────────────────────────
  const [files, setFiles] = useState<MockFile[]>([
    { name: 'project_brief.pdf', size: '1.2 MB', uploadedBy: 'Jordan Lee', uploadedAt: '2026-05-02T10:00:00Z' },
    { name: 'wireframes_v2.fig', size: '14.5 MB', uploadedBy: 'Sam Rivera', uploadedAt: '2026-05-15T14:30:00Z' },
    { name: 'database_schema.png', size: '840 KB', uploadedBy: 'Alex Morgan', uploadedAt: '2026-06-01T09:15:00Z' },
  ])
  const [newFileName, setNewFileName] = useState('')

  // ── Task Form Modal State ────────────────────────────────────
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  // ── Task Form State ──────────────────────────────────────────
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium')
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('todo')
  const [taskValError, setTaskValError] = useState('')

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  // ── Queries & Mutations ──────────────────────────────────────
  const { data: project, isLoading: loadingProject } = useProject(projectId)
  const { data: projectTasks = [], isLoading: loadingTasks, refetch: refetchTasks } = useTasksByProject(projectId)
  const { data: users = [] } = useUsers()
  
  const updateProjectMutation = useUpdateProject()
  const createTaskMutation = useCreateTask()
  const updateTaskMutation = useUpdateTask()
  const deleteTaskMutation = useDeleteTask()

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  // Initialize task form
  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title)
      setTaskDesc(editingTask.description)
      setTaskAssignee(editingTask.assigneeId)
      setTaskDueDate(editingTask.dueDate.split('T')[0])
      setTaskPriority(editingTask.priority)
      setTaskStatus(editingTask.status)
      setTaskValError('')
    } else {
      setTaskTitle('')
      setTaskDesc('')
      setTaskAssignee('')
      setTaskDueDate('')
      setTaskPriority('medium')
      setTaskStatus('todo')
      setTaskValError('')
    }
  }, [editingTask, isTaskModalOpen])

  if (!currentUser) return null

  if (loadingProject || loadingTasks) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">Project not found</h3>
        <button onClick={() => router.push('/dashboard/projects')} className="mt-4 text-xs font-semibold text-primary">
          Back to Projects
        </button>
      </div>
    )
  }

  // ── Task Aggregates ──────────────────────────────────────────
  const totalTasks = projectTasks.length
  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasks = projectTasks.filter((t) => {
    if (t.status === 'completed') return false
    return new Date(t.dueDate) < new Date()
  }).length

  // ── Handlers ─────────────────────────────────────────────────
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTaskValError('')

    if (!taskTitle.trim() || !taskDesc.trim() || !taskAssignee || !taskDueDate) {
      setTaskValError('All fields are required.')
      return
    }

    // Validation 1: Prevent duplicate task titles inside same project
    const isDuplicate = projectTasks.some((t) => 
      t.title.trim().toLowerCase() === taskTitle.trim().toLowerCase() && 
      (!editingTask || t.id !== editingTask.id)
    )
    if (isDuplicate) {
      setTaskValError('This task already exists in the project.')
      return
    }

    // Validation 2: Prevent selecting past deadlines
    const dueDateObj = new Date(taskDueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (dueDateObj < today) {
      setTaskValError('Please select a valid deadline.')
      return
    }

    // Validation 3: Prevent assigning completed tasks
    // "Prevent assigning completed tasks: Completed tasks cannot be reassigned."
    // If the task is completed and the assignee is changed
    if (editingTask && editingTask.status === 'completed' && editingTask.assigneeId !== taskAssignee) {
      setTaskValError('Completed tasks cannot be reassigned.')
      return
    }

    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          data: {
            title: taskTitle,
            description: taskDesc,
            assigneeId: taskAssignee,
            dueDate: taskDueDate,
            priority: taskPriority,
            status: taskStatus,
          },
        })
        await logActivity(
          currentUser.id,
          currentUser.name,
          'updated',
          'task',
          taskTitle,
          editingTask.id
        )
        setEditingTask(null)
      } else {
        const newTask = await createTaskMutation.mutateAsync({
          title: taskTitle,
          description: taskDesc,
          projectId: project.id,
          assigneeId: taskAssignee,
          dueDate: taskDueDate,
          priority: taskPriority,
          status: taskStatus,
        })
        await logActivity(
          currentUser.id,
          currentUser.name,
          'created',
          'task',
          taskTitle,
          newTask.id
        )
        setIsTaskModalOpen(false)
      }
      refetchTasks()
    } catch (err) {
      setTaskValError('Failed to save task. Try again.')
    }
  }

  const handleTaskStatusToggle = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
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
      refetchTasks()
    } catch (err) {
      alert('Failed to update task status')
    }
  }

  const handleTaskDelete = async (task: Task) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    try {
      await deleteTaskMutation.mutateAsync(task.id)
      await logActivity(
        currentUser.id,
        currentUser.name,
        'deleted',
        'task',
        task.title,
        task.id
      )
      refetchTasks()
    } catch (err) {
      alert('Failed to delete task')
    }
  }

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName.trim()) return
    const fileExtension = newFileName.includes('.') ? '' : '.txt'
    const newFile: MockFile = {
      name: newFileName + fileExtension,
      size: '24 KB',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString(),
    }
    setFiles([newFile, ...files])
    setNewFileName('')
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => router.push('/dashboard/projects')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </button>
      </div>

      {/* Main details banner */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
              project.status === 'active' && 'bg-primary/10 text-primary',
              project.status === 'completed' && 'bg-emerald/10 text-emerald',
              project.status === 'on-hold' && 'bg-amber/10 text-amber'
            )}>
              {project.status}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={12} />
              Deadline: {new Date(project.deadline).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">{project.description}</p>
        </div>

        {/* Project KPI breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-muted/30 border border-border/40 p-4 rounded-xl shrink-0">
          {[
            { label: 'Total Tasks', value: totalTasks, color: 'text-foreground' },
            { label: 'Completed', value: completedTasks, color: 'text-emerald' },
            { label: 'Pending', value: pendingTasks, color: 'text-amber' },
            { label: 'Overdue', value: overdueTasks, color: 'text-danger' },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-2">
              <div className={cn('text-xl font-bold tracking-tight', stat.color)}>{stat.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-border">
        {[
          { id: 'tasks', label: 'Tasks List', icon: CheckSquare },
          { id: 'members', label: 'Project Members', icon: Users },
          { id: 'files', label: 'File Attachments', icon: Paperclip },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-5 py-3 border-b-2 text-sm font-semibold transition-colors outline-none',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div>
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-foreground">Project Tasks</h2>
              {canManage && (
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
                >
                  <Plus size={14} />
                  Add Task
                </button>
              )}
            </div>

            {projectTasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
                <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-sm font-semibold text-foreground">No tasks inside project</h3>
                <p className="mt-1 text-xs text-muted-foreground">Get started by creating your first task.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {projectTasks.map((t) => {
                  const assignee = users.find((u) => u.id === t.assigneeId)
                  return (
                    <motion.div
                      key={t.id}
                      className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Quick complete checkbox */}
                        <input
                          type="checkbox"
                          checked={t.status === 'completed'}
                          onChange={() => handleTaskStatusToggle(t, t.status === 'completed' ? 'todo' : 'completed')}
                          className="mt-1 rounded border-border accent-primary h-4.5 w-4.5 cursor-pointer shrink-0"
                        />
                        <div className="min-w-0">
                          <a
                            href={`/dashboard/tasks/${t.id}`}
                            className={cn(
                              'text-sm font-bold hover:text-primary transition-colors flex items-center gap-1.5',
                              t.status === 'completed' && 'line-through text-muted-foreground'
                            )}
                          >
                            {t.title}
                            <ExternalLink size={12} className="text-muted-foreground/60 shrink-0" />
                          </a>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{t.description}</p>
                          <div className="flex flex-wrap gap-2.5 mt-2.5 text-[10px] font-medium text-muted-foreground">
                            <span className={cn(
                              'px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider',
                              t.priority === 'high' && 'bg-danger/10 text-danger',
                              t.priority === 'medium' && 'bg-warning/10 text-warning',
                              t.priority === 'low' && 'bg-info/10 text-info'
                            )}>
                              {t.priority}
                            </span>
                            <span>Due {new Date(t.dueDate).toLocaleDateString()}</span>
                            {assignee && (
                              <span className="flex items-center gap-1 font-semibold text-foreground/80">
                                <UserIcon size={10} />
                                Assigned to {assignee.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-end gap-2.5 border-t border-border/40 pt-3 sm:border-none sm:pt-0 shrink-0">
                        <button
                          onClick={() => { setEditingTask(t); setIsTaskModalOpen(true); }}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="Edit Task"
                        >
                          <Edit3 size={14} />
                        </button>
                        {canManage && (
                          <button
                            onClick={() => handleTaskDelete(t)}
                            className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger transition-colors"
                            title="Delete Task"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground border-b border-border pb-3">Project Members ({project.memberIds.length})</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {project.memberIds.map((uid) => {
                const member = users.find((u) => u.id === uid)
                if (!member) return null
                const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                return (
                  <div key={uid} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">{member.name}</div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-2.5 mt-0.5">
                        <span>{member.department}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-border" />
                        <span className="capitalize">{member.role}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            {/* Upload form */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-foreground">Attach New File</h3>
              <form onSubmit={handleFileUpload} className="space-y-3">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="File name (e.g. logo_mockup)"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo py-2 text-xs font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all"
                >
                  <Upload size={14} />
                  Upload Mock File
                </button>
              </form>
            </div>

            {/* Files list */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">Attached Files ({files.length})</h3>
              {files.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  No files attached to this project.
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {files.map((file) => (
                    <div key={file.name} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary/80 shrink-0" />
                        <div>
                          <div className="font-bold text-foreground">{file.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {file.size} • Uploaded by {file.uploadedBy}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* TASK ADD & EDIT MODAL OVERLAY */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl z-10"
            >
              <button
                onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>

              <h2 className="text-xl font-bold text-foreground mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h2>

              <form onSubmit={handleTaskSubmit} className="space-y-4">
                {taskValError && (
                  <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                    <AlertCircle size={14} className="shrink-0" />
                    {taskValError}
                  </div>
                )}

                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Task Title</label>
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <textarea
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    placeholder="Enter task description"
                    rows={3}
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none"
                  />
                </div>

                {/* Assignee */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Assigned Member</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  >
                    <option value="">Select a team member</option>
                    {users
                      .filter((u) => project.memberIds.includes(u.id))
                      .map((u) => (
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
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Priority */}
                  <div className="col-span-1 space-y-1">
                    <label className="text-xs font-semibold text-foreground">Priority</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
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
                      value={taskStatus}
                      onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
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
                    onClick={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
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
