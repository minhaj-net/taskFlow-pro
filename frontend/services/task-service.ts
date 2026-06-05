import type { Task, TaskStatus, TaskPriority } from '@/types'

const BASE = '/data'
const STORAGE_KEY = 'tfp_tasks'

function getLocalTasks(): Task[] | null {
  if (typeof window === 'undefined') return null
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

function saveLocalTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export async function getTasks(): Promise<Task[]> {
  const local = getLocalTasks()
  if (local) return local

  const res = await fetch(`${BASE}/tasks.json`)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  const data = await res.json()
  saveLocalTasks(data)
  return data
}

export async function getTaskById(id: string): Promise<Task | undefined> {
  const tasks = await getTasks()
  return tasks.find((t) => t.id === id)
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter((t) => t.projectId === projectId)
}

export async function getTasksByAssignee(userId: string): Promise<Task[]> {
  const tasks = await getTasks()
  return tasks.filter((t) => t.assigneeId === userId)
}

export async function createTask(
  data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments'>,
): Promise<Task> {
  await new Promise((r) => setTimeout(r, 400))
  const tasks = await getTasks()
  const newTask: Task = {
    ...data,
    id: `t-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    comments: [],
  }
  saveLocalTasks([...tasks, newTask])
  return newTask
}

export async function updateTask(
  id: string,
  data: Partial<Pick<Task, 'title' | 'description' | 'assigneeId' | 'priority' | 'status' | 'dueDate' | 'comments'>>,
): Promise<Task> {
  await new Promise((r) => setTimeout(r, 400))
  const tasks = await getTasks()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) throw new Error(`Task ${id} not found`)
  const updated = {
    ...tasks[index],
    ...data,
    updatedAt: new Date().toISOString()
  }
  tasks[index] = updated
  saveLocalTasks(tasks)
  return updated
}

export async function deleteTask(id: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 300))
  const tasks = await getTasks()
  saveLocalTasks(tasks.filter((t) => t.id !== id))
}
