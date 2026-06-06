'use client'

import { useEffect, useState, use, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FolderKanban, ArrowLeft, Calendar, Users,
  AlertTriangle, Paperclip, FileText,
  Upload, Plus, CheckSquare, Edit3, Trash2, X,
  ExternalLink, AlertCircle, RefreshCw,
  User as UserIcon, UserPlus, Download, File,
  CheckCircle2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession, getToken } from '@/lib/auth'
import { useProject, useUpdateProject } from '@/hooks/use-projects'
import { useTasksByProject, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/use-tasks'
import { useUsers } from '@/hooks/use-users'
import { logActivity } from '@/services/activity-service'
import type { User, Task, TaskStatus, TaskPriority } from '@/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface PageProps { params: Promise<{ id: string }> }

// ── File type from API ──────────────────────────────────────
interface ProjectFile {
  id: string
  projectId: string
  name: string
  originalName: string
  size: number
  mimeType: string
  uploadedBy: string
  uploadedByName: string
  createdAt: string
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function fileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType === 'application/pdf') return '📄'
  if (mimeType.includes('word')) return '📝'
  if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️'
  return '📁'
}

export default function ProjectDetailsPage({ params }: PageProps) {
  const router = useRouter()
  const resolvedParams = use(params)
  const projectId = resolvedParams.id

  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [activeTab, setActiveTab]     = useState<'tasks' | 'members' | 'files'>('members')

  // ── Task modal ──────────────────────────────────────────────
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask,     setEditingTask]     = useState<Task | null>(null)
  const [taskTitle,    setTaskTitle]    = useState('')
  const [taskDesc,     setTaskDesc]     = useState('')
  const [taskAssignee, setTaskAssignee] = useState('')
  const [taskDueDate,  setTaskDueDate]  = useState('')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('medium')
  const [taskStatus,   setTaskStatus]   = useState<TaskStatus>('todo')
  const [taskValError, setTaskValError] = useState('')

  // ── Member state ────────────────────────────────────────────
  const [memberError,   setMemberError]   = useState('')
  const [memberLoading, setMemberLoading] = useState(false)
  const [addMemberId,   setAddMemberId]   = useState('')

  // ── File state ──────────────────────────────────────────────
  const [files,        setFiles]        = useState<ProjectFile[]>([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [fileError,    setFileError]    = useState('')
  const [uploading,    setUploading]    = useState(false)
  const [dragOver,     setDragOver]     = useState(false)
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  const { data: project, isLoading: loadingProject, refetch: refetchProject } = useProject(projectId)
  const { data: projectTasks = [], isLoading: loadingTasks, refetch: refetchTasks } = useTasksByProject(projectId)
  const { data: users = [] } = useUsers()

  const updateProjectMutation = useUpdateProject()
  const createTaskMutation    = useCreateTask()
  const updateTaskMutation    = useUpdateTask()
  const deleteTaskMutation    = useDeleteTask()

  const canManage = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  // ── Fetch files ─────────────────────────────────────────────
  const fetchFiles = useCallback(async () => {
    setFilesLoading(true)
    setFileError('')
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/projects/${projectId}/files`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setFiles(json.data)
    } catch (e: any) {
      setFileError(e.message || 'Failed to load files')
    } finally {
      setFilesLoading(false)
    }
  }, [projectId])

  useEffect(() => {
    if (activeTab === 'files') fetchFiles()
  }, [activeTab, fetchFiles])

  // ── Task form init ──────────────────────────────────────────
  useEffect(() => {
    if (editingTask) {
      setTaskTitle(editingTask.title); setTaskDesc(editingTask.description)
      setTaskAssignee(editingTask.assigneeId); setTaskDueDate(editingTask.dueDate.split('T')[0])
      setTaskPriority(editingTask.priority); setTaskStatus(editingTask.status)
    } else {
      setTaskTitle(''); setTaskDesc(''); setTaskAssignee('')
      setTaskDueDate(''); setTaskPriority('medium'); setTaskStatus('todo')
    }
    setTaskValError('')
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

  const totalTasks     = projectTasks.length
  const completedTasks = projectTasks.filter(t => t.status === 'completed').length
  const pendingTasks   = totalTasks - completedTasks
  const overdueTasks   = projectTasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length

  // ── Task handlers ───────────────────────────────────────────
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setTaskValError('')
    if (!taskTitle.trim() || !taskDesc.trim() || !taskAssignee || !taskDueDate) {
      setTaskValError('All fields are required.'); return
    }
    const isDuplicate = projectTasks.some(t =>
      t.title.trim().toLowerCase() === taskTitle.trim().toLowerCase() && (!editingTask || t.id !== editingTask.id)
    )
    if (isDuplicate) { setTaskValError('This task already exists in the project.'); return }
    const due = new Date(taskDueDate); const today = new Date(); today.setHours(0,0,0,0)
    if (due < today) { setTaskValError('Please select a valid deadline.'); return }
    if (editingTask && editingTask.status === 'completed' && editingTask.assigneeId !== taskAssignee) {
      setTaskValError('Completed tasks cannot be reassigned.'); return
    }
    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({ id: editingTask.id, data: { title: taskTitle, description: taskDesc, assigneeId: taskAssignee, dueDate: taskDueDate, priority: taskPriority, status: taskStatus } })
        await logActivity(currentUser.id, currentUser.name, 'updated', 'task', taskTitle, editingTask.id)
        setEditingTask(null)
      } else {
        const newTask = await createTaskMutation.mutateAsync({ title: taskTitle, description: taskDesc, projectId: project.id, assigneeId: taskAssignee, dueDate: taskDueDate, priority: taskPriority, status: taskStatus })
        await logActivity(currentUser.id, currentUser.name, 'created', 'task', taskTitle, newTask.id)
        setIsTaskModalOpen(false)
      }
      refetchTasks()
    } catch { setTaskValError('Failed to save task. Try again.') }
  }

  const handleTaskStatusToggle = async (task: Task, newStatus: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({ id: task.id, data: { status: newStatus } })
      await logActivity(currentUser.id, currentUser.name, 'completed', 'task', task.title, task.id)
      refetchTasks()
    } catch { alert('Failed to update task status') }
  }

  const handleTaskDelete = async (task: Task) => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTaskMutation.mutateAsync(task.id)
      await logActivity(currentUser.id, currentUser.name, 'deleted', 'task', task.title, task.id)
      refetchTasks()
    } catch { alert('Failed to delete task') }
  }

  // ── Member handlers ─────────────────────────────────────────
  const handleAddMember = async () => {
    if (!addMemberId) return
    setMemberError(''); setMemberLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/projects/${project.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userId: addMemberId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      const addedUser = users.find(u => u.id === addMemberId)
      await logActivity(currentUser.id, currentUser.name, 'added', 'member', addedUser?.name ?? addMemberId, project.id)
      setAddMemberId('')
      refetchProject()
    } catch (e: any) {
      setMemberError(e.message || 'Failed to add member')
    } finally { setMemberLoading(false) }
  }

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from the project?')) return
    setMemberError(''); setMemberLoading(true)
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/projects/${project.id}/members/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      const removedUser = users.find(u => u.id === userId)
      await logActivity(currentUser.id, currentUser.name, 'deleted', 'member', removedUser?.name ?? userId, project.id)
      refetchProject()
    } catch (e: any) {
      setMemberError(e.message || 'Failed to remove member')
    } finally { setMemberLoading(false) }
  }

  // ── File handlers ───────────────────────────────────────────
  const processFile = async (file: File) => {
    setFileError(''); setUploading(true)
    try {
      const MAX = 10 * 1024 * 1024
      if (file.size > MAX) throw new Error('File too large (max 10 MB)')

      const data: string = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
      })

      const token = getToken()
      const res = await fetch(`${API_BASE}/projects/${projectId}/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: file.name, mimeType: file.type, size: file.size, data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      await logActivity(currentUser.id, currentUser.name, 'created', 'task', file.name, projectId)
      fetchFiles()
    } catch (e: any) {
      setFileError(e.message || 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/projects/${projectId}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      const link = document.createElement('a')
      link.href     = json.data.data
      link.download = fileName
      link.click()
    } catch (e: any) { alert(e.message || 'Download failed') }
  }

  const handleDeleteFile = async (fileId: string) => {
    setFileError('')
    try {
      const token = getToken()
      const res = await fetch(`${API_BASE}/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message)
      setDeletingFileId(null)
      fetchFiles()
    } catch (e: any) {
      setFileError(e.message || 'Failed to delete file')
      setDeletingFileId(null)
    }
  }

  // ── non-members (available to add) ─────────────────────────
  const nonMembers = users.filter(u => !project.memberIds.includes(u.id))

  return (
    <div className="space-y-6">
      {/* Back */}
      <button onClick={() => router.push('/dashboard/projects')}
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} /> Back to Projects
      </button>

      {/* Banner */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
              project.status === 'active'    && 'bg-primary/10 text-primary',
              project.status === 'completed' && 'bg-emerald-500/10 text-emerald-500',
              project.status === 'on-hold'   && 'bg-amber-500/10 text-amber-500',
            )}>{project.status}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar size={12} /> Deadline: {new Date(project.deadline).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">{project.description}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 border border-border/40 p-4 rounded-xl shrink-0">
          {[
            { label: 'Total',     value: totalTasks,     color: 'text-foreground'     },
            { label: 'Done',      value: completedTasks, color: 'text-emerald-500'    },
            { label: 'Pending',   value: pendingTasks,   color: 'text-amber-500'      },
            { label: 'Overdue',   value: overdueTasks,   color: 'text-red-500'        },
          ].map(s => (
            <div key={s.label} className="text-center px-2">
              <div className={cn('text-xl font-bold', s.color)}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-border gap-0">
        {[
          { id: 'members', label: 'Project Members',  icon: Users       },
          { id: 'tasks',   label: 'Tasks List',       icon: CheckSquare },
          { id: 'files',   label: 'File Attachments', icon: Paperclip   },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
            className={cn('flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 text-sm font-semibold transition-colors',
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
            <tab.icon size={15} /><span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>

      {/* ── TASKS TAB ──────────────────────────────────────────── */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Project Tasks ({totalTasks})</h2>
            {canManage && (
              <button onClick={() => setIsTaskModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all">
                <Plus size={14} /> Add Task
              </button>
            )}
          </div>
          {projectTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <CheckSquare className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-foreground">No tasks yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Create your first task to get started.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {projectTasks.map(t => {
                const assignee = users.find(u => u.id === t.assigneeId)
                return (
                  <motion.div key={t.id}
                    className="rounded-2xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start gap-3 min-w-0">
                      <input type="checkbox" checked={t.status === 'completed'}
                        onChange={() => handleTaskStatusToggle(t, t.status === 'completed' ? 'todo' : 'completed')}
                        className="mt-1 rounded accent-primary h-4 w-4 cursor-pointer shrink-0" />
                      <div className="min-w-0">
                        <a href={`/dashboard/tasks/${t.id}`}
                          className={cn('text-sm font-bold hover:text-primary transition-colors flex items-center gap-1.5',
                            t.status === 'completed' && 'line-through text-muted-foreground')}>
                          {t.title}<ExternalLink size={11} className="text-muted-foreground/60 shrink-0" />
                        </a>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{t.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2 text-[10px] font-medium">
                          <span className={cn('px-1.5 py-0.5 rounded-md font-bold uppercase',
                            t.priority === 'high'   && 'bg-red-500/10 text-red-500',
                            t.priority === 'medium' && 'bg-amber-500/10 text-amber-500',
                            t.priority === 'low'    && 'bg-blue-500/10 text-blue-500')}>{t.priority}</span>
                          <span className="text-muted-foreground">Due {new Date(t.dueDate).toLocaleDateString()}</span>
                          {assignee && <span className="flex items-center gap-1 text-foreground/70"><UserIcon size={10} />{assignee.name}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 border-t border-border/40 pt-3 sm:border-none sm:pt-0 shrink-0">
                      <button onClick={() => { setEditingTask(t); setIsTaskModalOpen(true) }}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Edit3 size={14} /></button>
                      {canManage && (
                        <button onClick={() => handleTaskDelete(t)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MEMBERS TAB ────────────────────────────────────────── */}
      {activeTab === 'members' && (
        <div className="space-y-5">
          {/* Add member — admin/manager only */}
          {canManage && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <UserPlus size={15} className="text-primary" /> Add Member to Project
              </h3>
              {memberError && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                  <AlertCircle size={13} />{memberError}
                </div>
              )}
              <div className="flex gap-2">
                <select value={addMemberId} onChange={e => setAddMemberId(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                  <option value="">Select a user to add…</option>
                  {nonMembers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} — {u.role} ({u.department || 'No dept'})</option>
                  ))}
                </select>
                <button onClick={handleAddMember} disabled={!addMemberId || memberLoading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-50">
                  <Plus size={14} />{memberLoading ? 'Adding…' : 'Add'}
                </button>
              </div>
              {nonMembers.length === 0 && (
                <p className="text-xs text-muted-foreground">All users are already members of this project.</p>
              )}
            </div>
          )}

          {/* Member list */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground border-b border-border pb-3">
              Current Members ({project.memberIds.length})
            </h3>
            {project.memberIds.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No members assigned yet.</p>
            ) : (
              <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                {project.memberIds.map(uid => {
                  const member = users.find(u => u.id === uid)
                  if (!member) return null
                  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  const isSelf = uid === currentUser.id
                  return (
                    <div key={uid}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-xs text-primary-foreground shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground flex items-center gap-1.5 truncate">
                            {member.name}
                            {isSelf && <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary uppercase">You</span>}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <span>{member.department || '—'}</span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className={cn('capitalize font-semibold',
                              member.role === 'admin'   && 'text-red-500',
                              member.role === 'manager' && 'text-amber-500',
                              member.role === 'member'  && 'text-blue-500',
                            )}>{member.role}</span>
                          </div>
                        </div>
                      </div>
                      {canManage && !isSelf && (
                        <button onClick={() => handleRemoveMember(uid)} disabled={memberLoading}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors shrink-0"
                          title="Remove from project">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── FILES TAB ──────────────────────────────────────────── */}
      {activeTab === 'files' && (
        <div className="space-y-5">
          {/* Upload zone */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Upload size={15} className="text-primary" /> Upload File
            </h3>

            {fileError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                <AlertCircle size={13} />{fileError}
                <button onClick={() => setFileError('')} className="ml-auto"><X size={12} /></button>
              </div>
            )}

            {/* Drag & drop zone */}
            <label
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                'flex flex-col items-center justify-center gap-3 w-full rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-all',
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30',
                uploading && 'pointer-events-none opacity-60',
              )}>
              <input type="file" className="hidden" onChange={handleFileInput} disabled={uploading} />
              {uploading ? (
                <RefreshCw size={28} className="animate-spin text-primary" />
              ) : (
                <Upload size={28} className="text-muted-foreground" />
              )}
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">
                  {uploading ? 'Uploading…' : 'Click or drag & drop a file'}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">Max 10 MB — any file type</p>
              </div>
            </label>
          </div>

          {/* File list */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">
                Attached Files {filesLoading ? '' : `(${files.length})`}
              </h3>
              <button onClick={fetchFiles} className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                <RefreshCw size={13} className={filesLoading ? 'animate-spin' : ''} />
              </button>
            </div>

            {filesLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-10">
                <Paperclip className="mx-auto h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-xs text-muted-foreground">No files attached yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {files.map(file => (
                  <div key={file.id} className="group py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-base shrink-0">
                        {fileIcon(file.mimeType)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {formatBytes(file.size)} · {file.uploadedByName} · {new Date(file.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleDownload(file.id, file.name)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" title="Download">
                        <Download size={14} />
                      </button>
                      {(canManage || file.uploadedBy === currentUser.id) && (
                        <button onClick={() => setDeletingFileId(file.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TASK MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsTaskModalOpen(false); setEditingTask(null) }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
              <button onClick={() => { setIsTaskModalOpen(false); setEditingTask(null) }}
                className="absolute right-4 top-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors">
                <X size={16} />
              </button>
              <h2 className="text-xl font-bold text-foreground mb-4">{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                {taskValError && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                    <AlertCircle size={13} />{taskValError}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Task Title</label>
                  <input type="text" value={taskTitle} onChange={e => setTaskTitle(e.target.value)}
                    placeholder="Enter task title"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Description</label>
                  <textarea value={taskDesc} onChange={e => setTaskDesc(e.target.value)} rows={3}
                    placeholder="Enter task description"
                    className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Assigned Member</label>
                  <select value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                    <option value="">Select a team member</option>
                    {users.filter(u => project.memberIds.includes(u.id)).map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.department || u.role})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Due Date</label>
                    <input type="date" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Priority</label>
                    <select value={taskPriority} onChange={e => setTaskPriority(e.target.value as TaskPriority)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Status</label>
                    <select value={taskStatus} onChange={e => setTaskStatus(e.target.value as TaskStatus)}
                      className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-all">
                      <option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setIsTaskModalOpen(false); setEditingTask(null) }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors">Cancel</button>
                  <button type="submit" disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                    className="rounded-xl bg-gradient-to-r from-primary to-tf-indigo px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                    {createTaskMutation.isPending || updateTaskMutation.isPending ? 'Saving…' : 'Save Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── DELETE FILE MODAL ───────────────────────────────────── */}
      <AnimatePresence>
        {deletingFileId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingFileId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl z-10">
              <h2 className="text-lg font-bold text-foreground">Delete File?</h2>
              <p className="text-xs text-muted-foreground mt-2">This file will be permanently removed and cannot be recovered.</p>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setDeletingFileId(null)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => handleDeleteFile(deletingFileId)}
                  className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
