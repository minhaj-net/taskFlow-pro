'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckSquare, ArrowLeft, Calendar, User, MessageSquare, Send,
  Clock, AlertTriangle, Paperclip, FileText, Upload, Plus,
  ShieldAlert, RefreshCw, Trash2, CheckCircle, Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getSession } from '@/lib/auth'
import { useTask, useUpdateTask } from '@/hooks/use-tasks'
import { useProjects } from '@/hooks/use-projects'
import { useUsers } from '@/hooks/use-users'
import { logActivity } from '@/services/activity-service'
import type { User as UserType, Task, TaskComment, TaskStatus } from '@/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function TaskDetailsPage({ params }: PageProps) {
  const router = useRouter()
  
  // Resolve params using React.use()
  const resolvedParams = use(params)
  const taskId = resolvedParams.id

  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  const [commentText, setCommentText] = useState('')

  // ── Mock Files System ────────────────────────────────────────
  const [taskFiles, setTaskFiles] = useState<{ name: string; size: string; date: string }[]>([
    { name: 'requirements.docx', size: '340 KB', date: '2026-06-02T11:00:00Z' },
  ])
  const [newFileName, setNewFileName] = useState('')

  useEffect(() => {
    const session = getSession()
    if (session) setCurrentUser(session.user)
  }, [])

  // ── Queries & Mutations ──────────────────────────────────────
  const { data: task, isLoading: loadingTask, refetch } = useTask(taskId)
  const { data: projects = [] } = useProjects()
  const { data: users = [] } = useUsers()
  const updateTaskMutation = useUpdateTask()

  if (!currentUser) return null

  if (loadingTask) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-sm font-semibold text-foreground">Task not found</h3>
        <button onClick={() => router.push('/dashboard/tasks')} className="mt-4 text-xs font-semibold text-primary">
          Back to Tasks
        </button>
      </div>
    )
  }

  const project = projects.find((p) => p.id === task.projectId)
  const assignee = users.find((u) => u.id === task.assigneeId)

  // ── Handlers ─────────────────────────────────────────────────
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    const newComment: TaskComment = {
      id: `comm-${Date.now()}`,
      userId: currentUser.id,
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
    }

    const updatedComments = [...(task.comments || []), newComment]

    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: { comments: updatedComments },
      })
      await logActivity(
        currentUser.id,
        currentUser.name,
        'updated',
        'task',
        `commented on: "${task.title}"`,
        task.id
      )
      setCommentText('')
      refetch()
    } catch (err) {
      alert('Failed to add comment')
    }
  }

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: task.id,
        data: { status: newStatus },
      })
      await logActivity(
        currentUser.id,
        currentUser.name,
        'updated',
        'task',
        `status to "${newStatus}" for: "${task.title}"`,
        task.id
      )
      refetch()
    } catch (err) {
      alert('Failed to update status')
    }
  }

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFileName.trim()) return
    setTaskFiles([
      ...taskFiles,
      { name: newFileName + '.pdf', size: '120 KB', date: new Date().toISOString() },
    ])
    setNewFileName('')
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header back link */}
      <div>
        <button
          onClick={() => router.push(project ? `/dashboard/projects/${project.id}` : '/dashboard/tasks')}
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          {project ? `Back to ${project.name}` : 'Back to Tasks'}
        </button>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Task Detail Info & Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className={cn(
                'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider',
                task.priority === 'high' && 'bg-danger/10 text-danger',
                task.priority === 'medium' && 'bg-warning/10 text-warning',
                task.priority === 'low' && 'bg-info/10 text-info'
              )}>
                {task.priority} Priority
              </span>
              {project && (
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                  Project: {project.name}
                </span>
              )}
            </div>

            <h1 className="text-xl font-extrabold text-foreground tracking-tight">{task.title}</h1>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Comments Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3">
              <MessageSquare className="h-4 w-4 text-primary" />
              Comments ({task.comments?.length || 0})
            </h2>

            {/* Comments Feed */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {(!task.comments || task.comments.length === 0) ? (
                <p className="text-xs text-muted-foreground py-6 text-center">No comments yet. Start the conversation!</p>
              ) : (
                task.comments.map((comm) => {
                  const commUser = users.find((u) => u.id === comm.userId)
                  const init = commUser?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
                  const time = new Date(comm.createdAt).toLocaleString(undefined, {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })

                  return (
                    <div key={comm.id} className="flex items-start gap-3 text-xs">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-tf-indigo flex items-center justify-center font-bold text-[10px] text-primary-foreground shrink-0 mt-0.5">
                        {init}
                      </div>
                      <div className="flex-1 bg-muted/40 border border-border/40 p-3 rounded-2xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground">{commUser?.name ?? 'Unknown User'}</span>
                          <span className="text-[10px] text-muted-foreground">{time}</span>
                        </div>
                        <p className="text-muted-foreground">{comm.content}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2 border-t border-border/60">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment…"
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-xl bg-gradient-to-r from-primary to-tf-indigo text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-all shrink-0"
              >
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Task Status & Details Sidebar */}
        <div className="space-y-6">
          {/* Status & Action Panel */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Task Status</h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              {[
                { id: 'todo', label: 'To Do', icon: Clock, color: 'hover:bg-slate-500/10 hover:text-slate-400 border-slate-500/30' },
                { id: 'in-progress', label: 'In Progress', icon: Play, color: 'hover:bg-indigo-500/10 hover:text-indigo-400 border-indigo-500/30' },
                { id: 'completed', label: 'Completed', icon: CheckCircle, color: 'hover:bg-emerald-500/10 hover:text-emerald-400 border-emerald-500/30' },
              ].map((s) => {
                const isActive = task.status === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStatusChange(s.id as TaskStatus)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-all duration-150',
                      isActive
                        ? s.id === 'todo' ? 'bg-slate-500/10 border-slate-500/50 text-slate-500' :
                          s.id === 'in-progress' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-500' :
                          'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                        : `bg-background text-muted-foreground border-border ${s.color}`
                    )}
                  >
                    <s.icon size={14} />
                    {s.label}
                  </button>
                )
              })}
            </div>

            <div className="border-t border-border/60 pt-4 space-y-3 text-xs">
              {/* Due Date info */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-semibold text-foreground flex items-center gap-1">
                  <Calendar size={12} />
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>

              {/* Assignee info */}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Assignee:</span>
                {assignee ? (
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[8px]">
                      {assignee.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    {assignee.name}
                  </span>
                ) : (
                  <span className="text-muted-foreground font-semibold">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Files Panel */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Task Attachments</h3>
            
            {/* Add File */}
            <form onSubmit={handleFileUpload} className="flex gap-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Doc name…"
                className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="h-8 w-8 rounded-xl bg-gradient-to-r from-primary to-tf-indigo text-primary-foreground flex items-center justify-center shadow-md hover:shadow-lg transition-all shrink-0"
              >
                <Plus size={14} />
              </button>
            </form>

            <div className="space-y-2">
              {taskFiles.map((file) => (
                <div key={file.name} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40 border border-border/40 text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={14} className="text-primary shrink-0" />
                    <span className="font-semibold text-foreground truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">{file.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
